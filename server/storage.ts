import { 
  users, type User, type InsertUser, 
  mentors, type Mentor, type InsertMentor,
  slots, type Slot, type InsertSlot,
  bookings, type Booking, type InsertBooking,
  reviews, type Review, type InsertReview,
  conversations, type Conversation, type InsertConversation,
  conversationParticipants, type ConversationParticipant, type InsertConversationParticipant,
  messages, type Message, type InsertMessage,
  applications, type Application, type InsertApplication
} from "@shared/schema";

// Database interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mentors
  getAllMentors(): Promise<Mentor[]>;
  getMentorById(id: number): Promise<Mentor | undefined>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  updateMentorRating(mentorId: number): Promise<void>;
  
  // Slots
  getMentorSlots(mentorId: number): Promise<Slot[]>;
  getSlotById(id: number): Promise<Slot | undefined>;
  createSlot(slot: InsertSlot): Promise<Slot>;
  markSlotAsBooked(id: number): Promise<void>;
  
  // Bookings
  getBookingById(id: number): Promise<Booking | undefined>;
  getStudentBookings(studentId: number): Promise<Booking[]>;
  getMentorBookings(mentorId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<void>;
  updateBookingReview(id: number, reviewId: number): Promise<void>;
  
  // Reviews
  getMentorReviews(mentorId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Conversations
  getUserConversations(userId: number): Promise<Conversation[]>;
  getConversationById(id: number): Promise<Conversation | undefined>;
  createConversation(): Promise<Conversation>;
  addConversationParticipant(conversationId: number, userId: number): Promise<void>;
  isConversationParticipant(conversationId: number, userId: number): Promise<boolean>;
  findConversationBetweenUsers(user1Id: number, user2Id: number): Promise<number | undefined>;
  
  // Messages
  getConversationMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(conversationId: number, userId: number): Promise<void>;
  
  // Applications
  createMentorApplication(application: InsertApplication): Promise<Application>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private mentorsData: Map<number, Mentor>;
  private slotsData: Map<number, Slot>;
  private bookingsData: Map<number, Booking>;
  private reviewsData: Map<number, Review>;
  private conversationsData: Map<number, Conversation>;
  private conversationParticipantsData: Map<number, ConversationParticipant>;
  private messagesData: Map<number, Message>;
  private applicationsData: Map<number, Application>;
  
  private userId: number;
  private mentorId: number;
  private slotId: number;
  private bookingId: number;
  private reviewId: number;
  private conversationId: number;
  private participantId: number;
  private messageId: number;
  private applicationId: number;
  
  constructor() {
    this.usersData = new Map();
    this.mentorsData = new Map();
    this.slotsData = new Map();
    this.bookingsData = new Map();
    this.reviewsData = new Map();
    this.conversationsData = new Map();
    this.conversationParticipantsData = new Map();
    this.messagesData = new Map();
    this.applicationsData = new Map();
    
    this.userId = 1;
    this.mentorId = 1;
    this.slotId = 1;
    this.bookingId = 1;
    this.reviewId = 1;
    this.conversationId = 1;
    this.participantId = 1;
    this.messageId = 1;
    this.applicationId = 1;
    
    // Create sample data
    this.initializeSampleData();
  }
  
  // Initialize sample data
  private async initializeSampleData() {
    // Sample users
    const user1 = await this.createUser({
      username: "student1",
      password: "password",
      email: "student1@example.com",
      userType: "student"
    });
    
    const user2 = await this.createUser({
      username: "mentor1",
      password: "password",
      email: "mentor1@example.com",
      userType: "mentor"
    });
    
    const user3 = await this.createUser({
      username: "student2",
      password: "password",
      email: "student2@example.com",
      userType: "student"
    });
    
    const user4 = await this.createUser({
      username: "mentor2",
      password: "password",
      email: "mentor2@example.com",
      userType: "mentor"
    });
    
    const user5 = await this.createUser({
      username: "student3",
      password: "password",
      email: "student3@example.com",
      userType: "student"
    });
    
    const user6 = await this.createUser({
      username: "mentor3",
      password: "password",
      email: "mentor3@example.com",
      userType: "mentor"
    });
    
    const user7 = await this.createUser({
      username: "mentor4",
      password: "password",
      email: "mentor4@example.com",
      userType: "mentor"
    });
    
    const user8 = await this.createUser({
      username: "mentor5",
      password: "password",
      email: "mentor5@example.com",
      userType: "mentor"
    });
    
    const user9 = await this.createUser({
      username: "mentor6",
      password: "password",
      email: "mentor6@example.com",
      userType: "mentor"
    });
    
    const user10 = await this.createUser({
      username: "mentor7",
      password: "password",
      email: "mentor7@example.com",
      userType: "mentor"
    });
    
    // Update user names and profile pictures
    this.usersData.set(user1.id, {
      ...user1,
      name: "Neha Gupta",
      profilePicture: "https://randomuser.me/api/portraits/women/65.jpg"
    });
    
    this.usersData.set(user2.id, {
      ...user2,
      name: "Priya Sharma",
      profilePicture: "https://randomuser.me/api/portraits/women/44.jpg"
    });
    
    this.usersData.set(user3.id, {
      ...user3,
      name: "Arjun Reddy",
      profilePicture: "https://randomuser.me/api/portraits/men/32.jpg"
    });
    
    this.usersData.set(user4.id, {
      ...user4,
      name: "Rahul Khanna",
      profilePicture: "https://randomuser.me/api/portraits/men/79.jpg"
    });
    
    this.usersData.set(user5.id, {
      ...user5,
      name: "Aisha Patel",
      profilePicture: "https://randomuser.me/api/portraits/women/55.jpg"
    });
    
    this.usersData.set(user6.id, {
      ...user6,
      name: "Vikram Singh",
      profilePicture: "https://randomuser.me/api/portraits/men/45.jpg"
    });
    
    this.usersData.set(user7.id, {
      ...user7,
      name: "Deepa Murthy",
      profilePicture: "https://randomuser.me/api/portraits/women/23.jpg"
    });
    
    this.usersData.set(user8.id, {
      ...user8,
      name: "Akash Mehta",
      profilePicture: "https://randomuser.me/api/portraits/men/62.jpg"
    });
    
    this.usersData.set(user9.id, {
      ...user9,
      name: "Ananya Desai",
      profilePicture: "https://randomuser.me/api/portraits/women/17.jpg"
    });
    
    this.usersData.set(user10.id, {
      ...user10,
      name: "Karan Malhotra",
      profilePicture: "https://randomuser.me/api/portraits/men/53.jpg"
    });
    
    // Sample mentors
    const mentor1 = await this.createMentor({
      userId: user2.id,
      bio: "Senior Software Engineer at Google with 5+ years of experience. Can help with college applications, interview preparation, and career guidance in tech.",
      university: "IIT Bombay",
      degree: "B.Tech in Computer Science",
      graduationYear: "2015",
      company: "Google",
      title: "Senior Software Engineer",
      experience: "5+",
      expertise: ["Computer Science", "Machine Learning", "Interview Prep"],
      languages: ["English", "Hindi"],
      mentorshipAreas: [
        "College Application Guidance",
        "Technical Interview Preparation",
        "Career Planning in Tech",
        "Resume Building"
      ]
    });
    
    const mentor2 = await this.createMentor({
      userId: user4.id,
      bio: "Management Consultant with experience in strategy and operations. Can help with MBA applications, CAT preparation, and consulting career advice.",
      university: "IIM Ahmedabad",
      degree: "MBA",
      graduationYear: "2016",
      company: "McKinsey",
      title: "Management Consultant",
      experience: "6",
      expertise: ["MBA", "Management Consulting", "CAT Preparation"],
      languages: ["English", "Hindi", "Punjabi"],
      mentorshipAreas: [
        "MBA Application Strategy",
        "CAT Exam Preparation",
        "Case Interview Practice",
        "Consulting Career Path"
      ]
    });
    
    const mentor3 = await this.createMentor({
      userId: user6.id,
      bio: "Mechanical Engineering graduate from IIT Delhi currently working at Tata Motors. Experienced in automotive design and manufacturing. Can mentor for JEE preparation and engineering career paths.",
      university: "IIT Delhi",
      degree: "B.Tech in Mechanical Engineering",
      graduationYear: "2017",
      company: "Tata Motors",
      title: "Senior Design Engineer",
      experience: "4",
      expertise: ["Mechanical Engineering", "JEE Advanced", "Automotive"],
      languages: ["English", "Hindi", "Punjabi"],
      mentorshipAreas: [
        "JEE Preparation",
        "Engineering Basics",
        "Career in Manufacturing",
        "Internship Guidance"
      ]
    });
    
    const mentor4 = await this.createMentor({
      userId: user7.id,
      bio: "Data Scientist at Amazon with background in Statistics and Machine Learning. PhD from IISc Bangalore. Can help with data science career transitions, interview preparation, and research guidance.",
      university: "IISc Bangalore",
      degree: "PhD in Computer Science",
      graduationYear: "2018",
      company: "Amazon",
      title: "Senior Data Scientist",
      experience: "7",
      expertise: ["Data Science", "Machine Learning", "AI Research"],
      languages: ["English", "Kannada", "Tamil"],
      mentorshipAreas: [
        "Data Science Career",
        "ML Interview Preparation",
        "Research Paper Guidance",
        "PhD Applications"
      ]
    });
    
    const mentor5 = await this.createMentor({
      userId: user8.id,
      bio: "UPSC Civil Services officer (IAS) with AIR 42. Can mentor for UPSC preparation, strategy, and interview techniques. Graduated from Delhi University before clearing the exam.",
      university: "Delhi University",
      degree: "BA Economics (Hons)",
      graduationYear: "2014",
      company: "Indian Administrative Service",
      title: "IAS Officer",
      experience: "6",
      expertise: ["UPSC", "Civil Services", "Public Policy"],
      languages: ["English", "Hindi", "Marathi"],
      mentorshipAreas: [
        "UPSC Preparation Strategy",
        "Mains Answer Writing",
        "Interview Techniques",
        "Optional Subject Selection"
      ]
    });
    
    const mentor6 = await this.createMentor({
      userId: user9.id,
      bio: "Chartered Accountant working at EY with specialization in taxation and audit. Can guide CA aspirants on exam preparation, articleship, and career progression in finance.",
      university: "ICAI",
      degree: "Chartered Accountancy",
      graduationYear: "2015",
      company: "Ernst & Young",
      title: "Senior Manager - Taxation",
      experience: "8",
      expertise: ["Chartered Accountancy", "Taxation", "Financial Analysis"],
      languages: ["English", "Hindi", "Gujarati"],
      mentorshipAreas: [
        "CA Exam Strategy",
        "Articleship Guidance",
        "Interview Preparation",
        "Career in Big 4"
      ]
    });
    
    const mentor7 = await this.createMentor({
      userId: user10.id,
      bio: "Product Manager at Flipkart with background in Computer Engineering. MBA from ISB Hyderabad. Can mentor for product management roles, B-school applications, and tech career transitions.",
      university: "ISB Hyderabad",
      degree: "MBA",
      graduationYear: "2019",
      company: "Flipkart",
      title: "Senior Product Manager",
      experience: "5",
      expertise: ["Product Management", "MBA", "Tech Career"],
      languages: ["English", "Hindi"],
      mentorshipAreas: [
        "Product Management Career",
        "MBA Applications",
        "GMAT Preparation",
        "Startup Advice"
      ]
    });
    
    // Sample slots for mentor1
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Morning slot
      const morningStart = new Date(date);
      morningStart.setHours(10, 0, 0);
      const morningEnd = new Date(date);
      morningEnd.setHours(11, 0, 0);
      
      await this.createSlot({
        mentorId: mentor1.id,
        startTime: morningStart,
        endTime: morningEnd
      });
      
      // Evening slot
      const eveningStart = new Date(date);
      eveningStart.setHours(18, 0, 0);
      const eveningEnd = new Date(date);
      eveningEnd.setHours(19, 0, 0);
      
      await this.createSlot({
        mentorId: mentor1.id,
        startTime: eveningStart,
        endTime: eveningEnd
      });
    }
    
    // Sample slots for mentor2
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Afternoon slot
      const afternoonStart = new Date(date);
      afternoonStart.setHours(14, 0, 0);
      const afternoonEnd = new Date(date);
      afternoonEnd.setHours(15, 0, 0);
      
      await this.createSlot({
        mentorId: mentor2.id,
        startTime: afternoonStart,
        endTime: afternoonEnd
      });
      
      // Evening slot
      const eveningStart = new Date(date);
      eveningStart.setHours(20, 0, 0);
      const eveningEnd = new Date(date);
      eveningEnd.setHours(21, 0, 0);
      
      await this.createSlot({
        mentorId: mentor2.id,
        startTime: eveningStart,
        endTime: eveningEnd
      });
    }
    
    // Sample slots for other mentors
    // Mentor 3 slots
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Morning slot
      const morningStart = new Date(date);
      morningStart.setHours(9, 0, 0);
      const morningEnd = new Date(date);
      morningEnd.setHours(10, 0, 0);
      
      await this.createSlot({
        mentorId: mentor3.id,
        startTime: morningStart,
        endTime: morningEnd
      });
      
      // Evening slot
      const eveningStart = new Date(date);
      eveningStart.setHours(19, 0, 0);
      const eveningEnd = new Date(date);
      eveningEnd.setHours(20, 0, 0);
      
      await this.createSlot({
        mentorId: mentor3.id,
        startTime: eveningStart,
        endTime: eveningEnd
      });
    }
    
    // Mentor 4 slots
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Afternoon slot
      const afternoonStart = new Date(date);
      afternoonStart.setHours(12, 0, 0);
      const afternoonEnd = new Date(date);
      afternoonEnd.setHours(13, 0, 0);
      
      await this.createSlot({
        mentorId: mentor4.id,
        startTime: afternoonStart,
        endTime: afternoonEnd
      });
      
      // Evening slot
      const eveningStart = new Date(date);
      eveningStart.setHours(21, 0, 0);
      const eveningEnd = new Date(date);
      eveningEnd.setHours(22, 0, 0);
      
      await this.createSlot({
        mentorId: mentor4.id,
        startTime: eveningStart,
        endTime: eveningEnd
      });
    }
    
    // Mentor 5 slots
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (i % 2 === 0) { // Even days only
        const eveningStart = new Date(date);
        eveningStart.setHours(18, 30, 0);
        const eveningEnd = new Date(date);
        eveningEnd.setHours(19, 30, 0);
        
        await this.createSlot({
          mentorId: mentor5.id,
          startTime: eveningStart,
          endTime: eveningEnd
        });
      }
    }
    
    // Mentor 6 slots
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (i % 2 === 1) { // Odd days only
        const morningStart = new Date(date);
        morningStart.setHours(7, 0, 0);
        const morningEnd = new Date(date);
        morningEnd.setHours(8, 0, 0);
        
        await this.createSlot({
          mentorId: mentor6.id,
          startTime: morningStart,
          endTime: morningEnd
        });
      }
      
      // Weekend evening slot
      if (i % 7 === 0 || i % 7 === 6) { // Saturday or Sunday
        const eveningStart = new Date(date);
        eveningStart.setHours(16, 0, 0);
        const eveningEnd = new Date(date);
        eveningEnd.setHours(17, 0, 0);
        
        await this.createSlot({
          mentorId: mentor6.id,
          startTime: eveningStart,
          endTime: eveningEnd
        });
      }
    }
    
    // Mentor 7 slots
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Late afternoon slot
      const afternoonStart = new Date(date);
      afternoonStart.setHours(16, 30, 0);
      const afternoonEnd = new Date(date);
      afternoonEnd.setHours(17, 30, 0);
      
      await this.createSlot({
        mentorId: mentor7.id,
        startTime: afternoonStart,
        endTime: afternoonEnd
      });
    }
    
    // Sample bookings and reviews
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 5);
    const pastStartTime = new Date(pastDate);
    pastStartTime.setHours(10, 0, 0);
    const pastEndTime = new Date(pastDate);
    pastEndTime.setHours(11, 0, 0);
    
    const pastSlot = await this.createSlot({
      mentorId: mentor1.id,
      startTime: pastStartTime,
      endTime: pastEndTime
    });
    
    await this.markSlotAsBooked(pastSlot.id);
    
    const booking = await this.createBooking({
      studentId: user1.id,
      mentorId: mentor1.id,
      slotId: pastSlot.id,
      status: "completed",
      startTime: pastStartTime,
      endTime: pastEndTime,
      amount: 1500,
      paymentStatus: "paid"
    });
    
    const review = await this.createReview({
      bookingId: booking.id,
      studentId: user1.id,
      mentorId: mentor1.id,
      rating: 5,
      comment: "Priya was extremely helpful with my Google interview preparation. She gave me insights into the interview process and shared valuable tips that I couldn't find elsewhere. Highly recommend!"
    });
    
    await this.updateBookingReview(booking.id, review.id);
    await this.updateMentorRating(mentor1.id);
    
    // Sample conversation
    const conversation = await this.createConversation();
    
    await this.addConversationParticipant(conversation.id, user1.id);
    await this.addConversationParticipant(conversation.id, user2.id);
    
    // Sample messages
    await this.createMessage({
      conversationId: conversation.id,
      senderId: user1.id,
      content: "Hi Priya, I'm interested in booking a session with you to discuss interview preparation for tech companies."
    });
    
    await this.createMessage({
      conversationId: conversation.id,
      senderId: user2.id,
      content: "Hello Neha! I'd be happy to help you with interview preparation. What specific companies are you targeting?"
    });
    
    await this.createMessage({
      conversationId: conversation.id,
      senderId: user1.id,
      content: "I'm mainly targeting Google and Microsoft. I have an interview coming up in a month."
    });
  }
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const user: User = {
      id,
      ...userData,
      createdAt,
      updatedAt
    };
    
    this.usersData.set(id, user);
    return user;
  }
  
  // Mentors
  async getAllMentors(): Promise<Mentor[]> {
    const mentors: Mentor[] = [];
    
    for (const mentor of this.mentorsData.values()) {
      const user = await this.getUser(mentor.userId);
      if (user) {
        const mentorWithDetails: Mentor = {
          ...mentor,
          name: user.name || user.username,
          email: user.email,
          profilePicture: user.profilePicture
        };
        
        mentors.push(mentorWithDetails);
      }
    }
    
    return mentors;
  }
  
  async getMentorById(id: number): Promise<Mentor | undefined> {
    const mentor = this.mentorsData.get(id);
    
    if (!mentor) {
      return undefined;
    }
    
    const user = await this.getUser(mentor.userId);
    
    if (!user) {
      return undefined;
    }
    
    // Get available slots
    const slots = await this.getMentorSlots(id);
    
    // Get reviews
    const reviews = await this.getMentorReviews(id);
    
    const mentorWithDetails: Mentor = {
      ...mentor,
      name: user.name || user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      availableSlots: slots,
      reviews
    };
    
    return mentorWithDetails;
  }
  
  async createMentor(mentorData: InsertMentor): Promise<Mentor> {
    const id = this.mentorId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const mentor: Mentor = {
      id,
      ...mentorData,
      rating: 0,
      reviewCount: 0,
      isVerified: true, // For sample data, set to true
      isActive: true,
      createdAt,
      updatedAt,
      name: "", // Will be populated when fetched
      email: "" // Will be populated when fetched
    };
    
    this.mentorsData.set(id, mentor);
    return mentor;
  }
  
  async updateMentorRating(mentorId: number): Promise<void> {
    const reviews = await this.getMentorReviews(mentorId);
    
    if (reviews.length === 0) {
      return;
    }
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Update mentor
    const mentor = this.mentorsData.get(mentorId);
    
    if (mentor) {
      this.mentorsData.set(mentorId, {
        ...mentor,
        rating: averageRating,
        reviewCount: reviews.length
      });
    }
  }
  
  // Slots
  async getMentorSlots(mentorId: number): Promise<Slot[]> {
    const now = new Date();
    
    return Array.from(this.slotsData.values())
      .filter(slot => slot.mentorId === mentorId && !slot.isBooked && new Date(slot.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }
  
  async getSlotById(id: number): Promise<Slot | undefined> {
    return this.slotsData.get(id);
  }
  
  async createSlot(slotData: InsertSlot): Promise<Slot> {
    const id = this.slotId++;
    const createdAt = new Date();
    
    const slot: Slot = {
      id,
      ...slotData,
      isBooked: false,
      createdAt
    };
    
    this.slotsData.set(id, slot);
    return slot;
  }
  
  async markSlotAsBooked(id: number): Promise<void> {
    const slot = this.slotsData.get(id);
    
    if (slot) {
      this.slotsData.set(id, {
        ...slot,
        isBooked: true
      });
    }
  }
  
  // Bookings
  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookingsData.get(id);
  }
  
  async getStudentBookings(studentId: number): Promise<Booking[]> {
    return Array.from(this.bookingsData.values())
      .filter(booking => booking.studentId === studentId)
      .map(booking => this.enrichBookingWithDetails(booking))
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }
  
  async getMentorBookings(mentorId: number): Promise<Booking[]> {
    return Array.from(this.bookingsData.values())
      .filter(booking => booking.mentorId === mentorId)
      .map(booking => this.enrichBookingWithDetails(booking))
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }
  
  private async enrichBookingWithDetails(booking: Booking): Promise<any> {
    const mentor = await this.getMentorById(booking.mentorId);
    const student = await this.getUser(booking.studentId);
    
    return {
      ...booking,
      mentor: {
        id: booking.mentorId,
        name: mentor?.name || "",
        company: mentor?.company || "",
        title: mentor?.title || "",
        profilePicture: mentor?.profilePicture
      },
      student: {
        id: booking.studentId,
        name: student?.name || student?.username || "",
        profilePicture: student?.profilePicture
      }
    };
  }
  
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const booking: Booking = {
      id,
      ...bookingData,
      reviewId: null,
      notes: null,
      createdAt,
      updatedAt
    };
    
    this.bookingsData.set(id, booking);
    return booking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<void> {
    const booking = this.bookingsData.get(id);
    
    if (booking) {
      this.bookingsData.set(id, {
        ...booking,
        status,
        updatedAt: new Date()
      });
    }
  }
  
  async updateBookingReview(id: number, reviewId: number): Promise<void> {
    const booking = this.bookingsData.get(id);
    
    if (booking) {
      this.bookingsData.set(id, {
        ...booking,
        reviewId,
        updatedAt: new Date()
      });
    }
  }
  
  // Reviews
  async getMentorReviews(mentorId: number): Promise<Review[]> {
    const reviews = Array.from(this.reviewsData.values())
      .filter(review => review.mentorId === mentorId);
    
    // Enrich with student details
    const enrichedReviews: Review[] = [];
    
    for (const review of reviews) {
      const student = await this.getUser(review.studentId);
      
      if (student) {
        enrichedReviews.push({
          ...review,
          studentName: student.name || student.username,
          studentPicture: student.profilePicture
        });
      }
    }
    
    return enrichedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const date = new Date();
    
    const review: Review = {
      id,
      ...reviewData,
      date,
      studentName: "", // Will be populated when fetched
      studentPicture: undefined
    };
    
    this.reviewsData.set(id, review);
    return review;
  }
  
  // Conversations
  async getUserConversations(userId: number): Promise<Conversation[]> {
    // Find all conversation participants for this user
    const participations = Array.from(this.conversationParticipantsData.values())
      .filter(participant => participant.userId === userId);
    
    const conversations: Conversation[] = [];
    
    for (const participation of participations) {
      const conversation = this.conversationsData.get(participation.conversationId);
      
      if (conversation) {
        // Get all participants
        const allParticipations = Array.from(this.conversationParticipantsData.values())
          .filter(p => p.conversationId === conversation.id);
        
        const participants = [];
        
        for (const p of allParticipations) {
          const user = await this.getUser(p.userId);
          
          if (user) {
            participants.push({
              id: user.id,
              name: user.name || user.username,
              profilePicture: user.profilePicture,
              title: await this.getUserTitle(user.id)
            });
          }
        }
        
        // Get last message
        const messages = await this.getConversationMessages(conversation.id);
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        
        // Count unread messages
        const unreadCount = messages.filter(
          m => m.senderId !== userId && !m.isRead
        ).length;
        
        conversations.push({
          ...conversation,
          participants,
          lastMessageContent: lastMessage ? lastMessage.content : "",
          lastMessageTime: lastMessage ? lastMessage.timestamp.toISOString() : conversation.createdAt.toISOString(),
          unreadCount
        });
      }
    }
    
    return conversations.sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  }
  
  private async getUserTitle(userId: number): Promise<string | undefined> {
    // Check if user is a mentor
    const mentor = Array.from(this.mentorsData.values())
      .find(m => m.userId === userId);
    
    return mentor?.title;
  }
  
  async getConversationById(id: number): Promise<Conversation | undefined> {
    const conversation = this.conversationsData.get(id);
    
    if (!conversation) {
      return undefined;
    }
    
    // Get all participants
    const participations = Array.from(this.conversationParticipantsData.values())
      .filter(p => p.conversationId === id);
    
    const participants = [];
    
    for (const p of participations) {
      const user = await this.getUser(p.userId);
      
      if (user) {
        participants.push({
          id: user.id,
          name: user.name || user.username,
          profilePicture: user.profilePicture,
          title: await this.getUserTitle(user.id)
        });
      }
    }
    
    // Get last message
    const messages = await this.getConversationMessages(id);
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    
    return {
      ...conversation,
      participants,
      lastMessageContent: lastMessage ? lastMessage.content : "",
      lastMessageTime: lastMessage ? lastMessage.timestamp.toISOString() : conversation.createdAt.toISOString(),
      unreadCount: 0 // Not relevant for this context
    };
  }
  
  async createConversation(): Promise<Conversation> {
    const id = this.conversationId++;
    const createdAt = new Date();
    
    const conversation: Conversation = {
      id,
      createdAt,
      participants: [], // Will be populated when fetched
      lastMessageContent: "",
      lastMessageTime: "",
      unreadCount: 0
    };
    
    this.conversationsData.set(id, conversation);
    return conversation;
  }
  
  async addConversationParticipant(conversationId: number, userId: number): Promise<void> {
    const id = this.participantId++;
    const createdAt = new Date();
    
    const participant: ConversationParticipant = {
      id,
      conversationId,
      userId,
      createdAt
    };
    
    this.conversationParticipantsData.set(id, participant);
  }
  
  async isConversationParticipant(conversationId: number, userId: number): Promise<boolean> {
    return Array.from(this.conversationParticipantsData.values())
      .some(p => p.conversationId === conversationId && p.userId === userId);
  }
  
  async findConversationBetweenUsers(user1Id: number, user2Id: number): Promise<number | undefined> {
    // Find all conversations for user1
    const user1Participations = Array.from(this.conversationParticipantsData.values())
      .filter(p => p.userId === user1Id)
      .map(p => p.conversationId);
    
    // Find all conversations for user2
    const user2Participations = Array.from(this.conversationParticipantsData.values())
      .filter(p => p.userId === user2Id)
      .map(p => p.conversationId);
    
    // Find common conversations
    const commonConversation = user1Participations.find(id => user2Participations.includes(id));
    
    return commonConversation;
  }
  
  // Messages
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    const messages = Array.from(this.messagesData.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Enrich with sender details
    const enrichedMessages: Message[] = [];
    
    for (const message of messages) {
      const sender = await this.getUser(message.senderId);
      
      if (sender) {
        enrichedMessages.push({
          ...message,
          senderName: sender.name || sender.username,
          senderAvatar: sender.profilePicture
        });
      }
    }
    
    return enrichedMessages;
  }
  
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const timestamp = new Date();
    
    const message: Message = {
      id,
      ...messageData,
      isRead: false,
      timestamp,
      senderName: "", // Will be populated when fetched
      senderAvatar: undefined
    };
    
    this.messagesData.set(id, message);
    return message;
  }
  
  async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    const messages = Array.from(this.messagesData.values())
      .filter(m => m.conversationId === conversationId && m.senderId !== userId && !m.isRead);
    
    for (const message of messages) {
      this.messagesData.set(message.id, {
        ...message,
        isRead: true
      });
    }
  }
  
  // Applications
  async createMentorApplication(applicationData: InsertApplication): Promise<Application> {
    const id = this.applicationId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const application: Application = {
      id,
      ...applicationData,
      status: "pending",
      reviewedBy: null,
      reviewNotes: null,
      createdAt,
      updatedAt
    };
    
    this.applicationsData.set(id, application);
    return application;
  }
}

export const storage = new MemStorage();
