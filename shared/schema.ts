import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name"),
  userType: text("user_type", { enum: ["mentor", "student", "admin"] }).notNull().default("student"),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  university: text("university"),
  degree: text("degree"),
  graduationYear: text("graduation_year"),
  company: text("company"),
  title: text("title"),
  experience: text("experience"),
  languages: jsonb("languages").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  userType: true,
});

// Mentors table
export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bio: text("bio").notNull(),
  university: text("university").notNull(),
  degree: text("degree").notNull(),
  graduationYear: text("graduation_year").notNull(),
  company: text("company").notNull(),
  title: text("title").notNull(),
  experience: text("experience").notNull(),
  expertise: jsonb("expertise").$type<string[]>().notNull(),
  languages: jsonb("languages").$type<string[]>().notNull(),
  mentorshipAreas: jsonb("mentorship_areas").$type<string[]>(),
  rating: doublePrecision("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
  rating: true,
  reviewCount: true,
  isVerified: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

// Availability slots table
export const slots = pgTable("slots", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").notNull().references(() => mentors.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isBooked: boolean("is_booked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSlotSchema = createInsertSchema(slots).omit({
  id: true,
  isBooked: true,
  createdAt: true,
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  mentorId: integer("mentor_id").notNull().references(() => mentors.id),
  slotId: integer("slot_id").notNull().references(() => slots.id),
  status: text("status").notNull().default("confirmed"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  amount: integer("amount").notNull(),
  paymentStatus: text("payment_status").notNull().default("paid"),
  reviewId: integer("review_id").references(() => reviews.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  reviewId: true,
  createdAt: true,
  updatedAt: true,
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  mentorId: integer("mentor_id").notNull().references(() => mentors.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  date: true,
});

// Conversations table
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

// Conversation participants
export const conversationParticipants = pgTable("conversation_participants", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertConversationParticipantSchema = createInsertSchema(conversationParticipants).omit({
  id: true,
  createdAt: true,
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  timestamp: true,
});

// Applications table (for mentor applications)
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  university: text("university").notNull(),
  degree: text("degree").notNull(),
  graduationYear: text("graduation_year").notNull(),
  company: text("company").notNull(),
  title: text("title").notNull(),
  experience: text("experience").notNull(),
  bio: text("bio").notNull(),
  expertiseAreas: text("expertise_areas").notNull(),
  languages: text("languages").notNull(),
  linkedinProfile: text("linkedin_profile"),
  hearAboutUs: text("hear_about_us").notNull(),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  status: true,
  reviewedBy: true,
  reviewNotes: true,
  createdAt: true,
  updatedAt: true,
});

// Type Definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Mentor = typeof mentors.$inferSelect & {
  profilePicture?: string;
  name: string;
  email: string;
  availableSlots?: Slot[];
  reviews?: Review[];
};
export type InsertMentor = z.infer<typeof insertMentorSchema>;

export type Slot = typeof slots.$inferSelect;
export type InsertSlot = z.infer<typeof insertSlotSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Review = typeof reviews.$inferSelect & {
  studentName: string;
  studentPicture?: string;
};
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Conversation = typeof conversations.$inferSelect & {
  participants: {
    id: number;
    name: string;
    profilePicture?: string;
    title?: string;
  }[];
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
};
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type ConversationParticipant = typeof conversationParticipants.$inferSelect;
export type InsertConversationParticipant = z.infer<typeof insertConversationParticipantSchema>;

export type Message = typeof messages.$inferSelect & {
  senderName: string;
  senderAvatar?: string;
};
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type UserBooking = typeof bookings.$inferSelect & {
  mentor: {
    id: number;
    name: string;
    company: string;
    title: string;
    profilePicture?: string;
  };
  student: {
    id: number;
    name: string;
    profilePicture?: string;
  };
};
