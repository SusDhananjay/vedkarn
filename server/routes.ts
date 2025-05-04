import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { setupSignalingServer } from "./webrtc/signaling";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server for video calls
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  setupSignalingServer(wss);

  // Set up session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "mentorconnect-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) { // In production, use proper password hashing
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // ====== API Routes ======

  // Authentication
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(validatedData);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Error registering user" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Mentors
  app.get("/api/mentors", async (req, res) => {
    try {
      const mentors = await storage.getAllMentors();
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching mentors" });
    }
  });

  app.get("/api/mentors/:id", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      const mentor = await storage.getMentorById(mentorId);
      
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      
      res.json(mentor);
    } catch (error) {
      res.status(500).json({ message: "Error fetching mentor" });
    }
  });

  app.post("/api/mentor/apply", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to apply" });
    }

    try {
      const userId = (req.user as any).id;
      const application = await storage.createMentorApplication({
        userId,
        ...req.body
      });
      
      res.status(201).json({ message: "Application submitted successfully", id: application.id });
    } catch (error) {
      res.status(500).json({ message: "Error submitting application" });
    }
  });

  // Slots
  app.get("/api/mentors/:id/slots", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      const slots = await storage.getMentorSlots(mentorId);
      res.json(slots);
    } catch (error) {
      res.status(500).json({ message: "Error fetching slots" });
    }
  });

  app.get("/api/slots/:id", async (req, res) => {
    try {
      const slotId = parseInt(req.params.id);
      const slot = await storage.getSlotById(slotId);
      
      if (!slot) {
        return res.status(404).json({ message: "Slot not found" });
      }
      
      res.json(slot);
    } catch (error) {
      res.status(500).json({ message: "Error fetching slot" });
    }
  });

  // Bookings
  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to book a session" });
    }

    try {
      const studentId = (req.user as any).id;
      const { mentorId, slotId, paymentDetails } = req.body;
      
      // In a real application, process payment here
      // For now, we'll assume payment is successful
      
      const slot = await storage.getSlotById(slotId);
      if (!slot) {
        return res.status(404).json({ message: "Slot not found" });
      }
      
      if (slot.isBooked) {
        return res.status(400).json({ message: "This slot is already booked" });
      }
      
      const booking = await storage.createBooking({
        studentId,
        mentorId,
        slotId,
        status: "confirmed",
        startTime: slot.startTime,
        endTime: slot.endTime,
        amount: 1500, // Fixed price of 1500 INR
        paymentStatus: "paid"
      });
      
      // Mark slot as booked
      await storage.markSlotAsBooked(slotId);
      
      res.status(201).json({ message: "Booking created successfully", bookingId: booking.id });
    } catch (error) {
      res.status(500).json({ message: "Error creating booking" });
    }
  });

  app.get("/api/bookings/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view bookings" });
    }

    try {
      const userId = (req.user as any).id;
      const userType = (req.user as any).userType;
      
      let bookings;
      if (userType === "student") {
        bookings = await storage.getStudentBookings(userId);
      } else {
        bookings = await storage.getMentorBookings(userId);
      }
      
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view booking details" });
    }

    try {
      const bookingId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      const booking = await storage.getBookingById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the user is either the student or the mentor for this booking
      if (booking.studentId !== userId && booking.mentorId !== userId) {
        return res.status(403).json({ message: "You don't have permission to view this booking" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error fetching booking" });
    }
  });

  app.post("/api/bookings/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to complete a session" });
    }

    try {
      const bookingId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      const booking = await storage.getBookingById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the user is either the student or the mentor for this booking
      if (booking.studentId !== userId && booking.mentorId !== userId) {
        return res.status(403).json({ message: "You don't have permission to complete this booking" });
      }
      
      await storage.updateBookingStatus(bookingId, "completed");
      
      res.json({ message: "Session marked as completed" });
    } catch (error) {
      res.status(500).json({ message: "Error completing session" });
    }
  });

  // Reviews
  app.post("/api/reviews", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to leave a review" });
    }

    try {
      const studentId = (req.user as any).id;
      const { bookingId, mentorId, rating, comment } = req.body;
      
      const booking = await storage.getBookingById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the user is the student for this booking
      if (booking.studentId !== studentId) {
        return res.status(403).json({ message: "You don't have permission to review this session" });
      }
      
      // Check if the booking is completed
      if (booking.status !== "completed") {
        return res.status(400).json({ message: "You can only review completed sessions" });
      }
      
      // Check if the booking already has a review
      if (booking.reviewId) {
        return res.status(400).json({ message: "You have already reviewed this session" });
      }
      
      const review = await storage.createReview({
        bookingId,
        studentId,
        mentorId,
        rating,
        comment
      });
      
      // Update booking with review ID
      await storage.updateBookingReview(bookingId, review.id);
      
      // Update mentor's average rating
      await storage.updateMentorRating(mentorId);
      
      res.status(201).json({ message: "Review submitted successfully", reviewId: review.id });
    } catch (error) {
      res.status(500).json({ message: "Error submitting review" });
    }
  });

  app.get("/api/mentors/:id/reviews", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      const reviews = await storage.getMentorReviews(mentorId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  // Messages
  app.get("/api/messages/conversations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view conversations" });
    }

    try {
      const userId = (req.user as any).id;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching conversations" });
    }
  });

  app.get("/api/messages/conversation/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view conversation" });
    }

    try {
      const conversationId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      // Check if user is a participant
      const isParticipant = await storage.isConversationParticipant(conversationId, userId);
      
      if (!isParticipant) {
        return res.status(403).json({ message: "You don't have permission to view this conversation" });
      }
      
      const conversation = await storage.getConversationById(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching conversation" });
    }
  });

  app.post("/api/messages/conversation/mentor/:mentorId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to message a mentor" });
    }

    try {
      const userId = (req.user as any).id;
      const mentorId = parseInt(req.params.mentorId);
      
      // Check if conversation already exists
      let conversationId = await storage.findConversationBetweenUsers(userId, mentorId);
      
      // If not, create a new conversation
      if (!conversationId) {
        const conversation = await storage.createConversation();
        conversationId = conversation.id;
        
        // Add participants
        await storage.addConversationParticipant(conversationId, userId);
        await storage.addConversationParticipant(conversationId, mentorId);
      }
      
      res.json({ conversationId });
    } catch (error) {
      res.status(500).json({ message: "Error creating conversation" });
    }
  });

  app.get("/api/messages/:conversationId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view messages" });
    }

    try {
      const conversationId = parseInt(req.params.conversationId);
      const userId = (req.user as any).id;
      
      // Check if user is a participant
      const isParticipant = await storage.isConversationParticipant(conversationId, userId);
      
      if (!isParticipant) {
        return res.status(403).json({ message: "You don't have permission to view these messages" });
      }
      
      const messages = await storage.getConversationMessages(conversationId);
      
      // Mark unread messages as read
      await storage.markMessagesAsRead(conversationId, userId);
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.post("/api/messages/:conversationId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to send messages" });
    }

    try {
      const conversationId = parseInt(req.params.conversationId);
      const senderId = (req.user as any).id;
      const { content } = req.body;
      
      // Check if user is a participant
      const isParticipant = await storage.isConversationParticipant(conversationId, senderId);
      
      if (!isParticipant) {
        return res.status(403).json({ message: "You don't have permission to send messages in this conversation" });
      }
      
      const message = await storage.createMessage({
        conversationId,
        senderId,
        content
      });
      
      res.status(201).json({ messageId: message.id });
    } catch (error) {
      res.status(500).json({ message: "Error sending message" });
    }
  });
  
  // Admin routes
  // Create admin user if it doesn't exist
  const setupAdminUser = async () => {
    try {
      let adminUser = await storage.getUserByUsername("adityarekhe1030");
      
      if (!adminUser) {
        adminUser = await storage.createUser({
          username: "adityarekhe1030",
          password: "Aditya@1030",
          email: "adityarekhe1030@gmail.com",
          userType: "admin"
        });
        
        console.log("Admin user created successfully");
      }
    } catch (error) {
      console.error("Error setting up admin user:", error);
    }
  };
  
  setupAdminUser();
  
  // Middleware to check if user is admin
  const isAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in" });
    }
    
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin permission required" });
    }
    
    next();
  };
  
  // Get all applications (admin only)
  app.get("/api/admin/applications", isAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching applications" });
    }
  });
  
  // Get specific application (admin only)
  app.get("/api/admin/applications/:id", isAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplicationById(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Error fetching application" });
    }
  });
  
  // Update application status (admin only)
  app.post("/api/admin/applications/:id/update", isAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const { status, reviewNotes } = req.body;
      const adminId = (req.user as any).id;
      
      const application = await storage.getApplicationById(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      await storage.updateApplicationStatus(applicationId, status, adminId, reviewNotes);
      
      res.json({ message: `Application ${status} successfully` });
    } catch (error) {
      res.status(500).json({ message: "Error updating application status" });
    }
  });

  return httpServer;
}
