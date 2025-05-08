import {
  users, categories, tickets, comments, notifications,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Ticket, type InsertTicket,
  type Comment, type InsertComment,
  type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Ticket operations
  getTicket(id: number): Promise<Ticket | undefined>;
  getTicketWithDetails(id: number): Promise<any | undefined>;
  getTickets(filters?: any): Promise<Ticket[]>;
  getTicketsWithDetails(filters?: any): Promise<any[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<Ticket>): Promise<Ticket | undefined>;
  deleteTicket(id: number): Promise<boolean>;

  // Comment operations
  getComment(id: number): Promise<Comment | undefined>;
  getCommentsByTicket(ticketId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;

  // Notification operations
  getNotification(id: number): Promise<Notification | undefined>;
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  getUnreadNotificationsByUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;
  deleteNotification(id: number): Promise<boolean>;

  // Stats operations
  getTicketStats(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private tickets: Map<number, Ticket>;
  private comments: Map<number, Comment>;
  private notifications: Map<number, Notification>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private ticketIdCounter: number;
  private commentIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.tickets = new Map();
    this.comments = new Map();
    this.notifications = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.ticketIdCounter = 1;
    this.commentIdCounter = 1;
    this.notificationIdCounter = 1;

    // Initialize with default data
    this.seedData();
  }

  private seedData() {
    // Seed users
    const adminUser = this.createUser({
      username: "admin",
      password: "password123",
      name: "John Doe",
      email: "admin@example.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3"
    });

    const agentUser = this.createUser({
      username: "agent",
      password: "password123",
      name: "Jane Smith",
      email: "agent@example.com",
      role: "agent",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3"
    });

    const supportUser = this.createUser({
      username: "support",
      password: "password123",
      name: "Alex Johnson",
      email: "support@example.com",
      role: "agent",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3"
    });

    const regularUser = this.createUser({
      username: "user",
      password: "password123",
      name: "Mike Wilson",
      email: "user@example.com",
      role: "user",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
    });

    // Seed categories
    const technicalCategory = this.createCategory({
      name: "Technical",
      description: "Technical issues with the platform"
    });

    const billingCategory = this.createCategory({
      name: "Billing",
      description: "Payment and subscription issues"
    });

    const accountCategory = this.createCategory({
      name: "Account",
      description: "Account management issues"
    });

    const featureCategory = this.createCategory({
      name: "Feature Request",
      description: "Requests for new features"
    });

    // Seed tickets
    const ticket1 = this.createTicket({
      subject: "Unable to access customer portal",
      description: "When I try to log in to the customer portal, I get an error message saying 'Invalid credentials' even though I'm sure my password is correct.",
      status: "in_progress",
      priority: "high",
      categoryId: technicalCategory.id,
      createdById: regularUser.id,
      assignedToId: adminUser.id
    });

    const ticket2 = this.createTicket({
      subject: "System throwing error during checkout",
      description: "I get an error during the checkout process when I try to use my credit card. The error says 'Payment processing failed'.",
      status: "open",
      priority: "high",
      categoryId: technicalCategory.id,
      createdById: regularUser.id,
      assignedToId: agentUser.id
    });

    const ticket3 = this.createTicket({
      subject: "Need to update billing information",
      description: "I need to update my credit card details as my old card has expired.",
      status: "resolved",
      priority: "medium",
      categoryId: billingCategory.id,
      createdById: regularUser.id,
      assignedToId: supportUser.id
    });

    const ticket4 = this.createTicket({
      subject: "Feature request: Dark mode",
      description: "I would like to request a dark mode feature for the web application to reduce eye strain when using it at night.",
      status: "open",
      priority: "low",
      categoryId: featureCategory.id,
      createdById: regularUser.id,
      assignedToId: supportUser.id
    });

    const ticket5 = this.createTicket({
      subject: "Integration with third-party API failing",
      description: "The integration with the third-party payment API is failing intermittently.",
      status: "in_progress",
      priority: "medium",
      categoryId: technicalCategory.id,
      createdById: agentUser.id,
      assignedToId: adminUser.id
    });

    // Seed comments
    this.createComment({
      content: "I've tried clearing my cache and cookies, but still having the same issue.",
      ticketId: ticket1.id,
      userId: regularUser.id
    });

    this.createComment({
      content: "Have you tried using a different browser? Let me know if that works.",
      ticketId: ticket1.id,
      userId: adminUser.id
    });

    // Seed notifications
    this.createNotification({
      message: "New high priority ticket assigned to you",
      type: "warning",
      userId: adminUser.id,
      ticketId: ticket1.id
    });

    this.createNotification({
      message: "Ticket #1234 has been resolved",
      type: "success",
      userId: adminUser.id,
      ticketId: ticket3.id
    });

    this.createNotification({
      message: "New comment on ticket #1235",
      type: "info",
      userId: adminUser.id,
      ticketId: ticket1.id
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Ticket operations
  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getTicketWithDetails(id: number): Promise<any | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;

    const createdBy = this.users.get(ticket.createdById);
    const assignedTo = ticket.assignedToId ? this.users.get(ticket.assignedToId) : null;
    const category = ticket.categoryId ? this.categories.get(ticket.categoryId) : null;
    const comments = await this.getCommentsByTicket(id);

    return {
      ...ticket,
      createdBy,
      assignedTo,
      category,
      comments
    };
  }

  async getTickets(filters?: any): Promise<Ticket[]> {
    let tickets = Array.from(this.tickets.values());
    
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        tickets = tickets.filter(ticket => filters.status.includes(ticket.status));
      }
      
      if (filters.priority && filters.priority.length > 0) {
        tickets = tickets.filter(ticket => filters.priority.includes(ticket.priority));
      }
      
      if (filters.categoryId) {
        tickets = tickets.filter(ticket => ticket.categoryId === filters.categoryId);
      }
      
      if (filters.assignedToId) {
        tickets = tickets.filter(ticket => ticket.assignedToId === filters.assignedToId);
      }
      
      if (filters.createdById) {
        tickets = tickets.filter(ticket => ticket.createdById === filters.createdById);
      }
    }
    
    return tickets;
  }

  async getTicketsWithDetails(filters?: any): Promise<any[]> {
    const tickets = await this.getTickets(filters);
    return Promise.all(tickets.map(async (ticket) => {
      const createdBy = this.users.get(ticket.createdById);
      const assignedTo = ticket.assignedToId ? this.users.get(ticket.assignedToId) : null;
      const category = ticket.categoryId ? this.categories.get(ticket.categoryId) : null;
      
      return {
        ...ticket,
        createdBy,
        assignedTo,
        category
      };
    }));
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.ticketIdCounter++;
    const now = new Date();
    const ticket: Ticket = { 
      ...insertTicket, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.tickets.set(id, ticket);
    
    // Create notification for the assigned user
    if (ticket.assignedToId) {
      this.createNotification({
        message: `New ticket assigned to you: ${ticket.subject}`,
        type: "info",
        userId: ticket.assignedToId,
        ticketId: id,
        read: false
      });
    }
    
    return ticket;
  }

  async updateTicket(id: number, ticketData: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;

    const prevAssignedTo = ticket.assignedToId;
    const updatedTicket = { 
      ...ticket, 
      ...ticketData,
      updatedAt: new Date()
    };
    this.tickets.set(id, updatedTicket);
    
    // Create notification if ticket is assigned to a new user
    if (ticketData.assignedToId && ticketData.assignedToId !== prevAssignedTo) {
      this.createNotification({
        message: `Ticket #${id} has been assigned to you`,
        type: "info",
        userId: ticketData.assignedToId,
        ticketId: id,
        read: false
      });
    }
    
    // Create notification if status changes to resolved
    if (ticketData.status === "resolved" && ticket.status !== "resolved") {
      this.createNotification({
        message: `Ticket #${id} has been resolved`,
        type: "success",
        userId: ticket.createdById,
        ticketId: id,
        read: false
      });
    }
    
    return updatedTicket;
  }

  async deleteTicket(id: number): Promise<boolean> {
    // Delete associated comments
    Array.from(this.comments.values())
      .filter(comment => comment.ticketId === id)
      .forEach(comment => this.comments.delete(comment.id));
      
    // Delete associated notifications
    Array.from(this.notifications.values())
      .filter(notification => notification.ticketId === id)
      .forEach(notification => this.notifications.delete(notification.id));
      
    return this.tickets.delete(id);
  }

  // Comment operations
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async getCommentsByTicket(ticketId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.ticketId === ticketId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const comment: Comment = { 
      ...insertComment, 
      id,
      createdAt: new Date()
    };
    this.comments.set(id, comment);
    
    // Get ticket and create notification for relevant users
    const ticket = this.tickets.get(comment.ticketId);
    if (ticket) {
      // Notify ticket creator if they didn't create the comment
      if (ticket.createdById !== comment.userId) {
        this.createNotification({
          message: `New comment on your ticket: ${ticket.subject}`,
          type: "info",
          userId: ticket.createdById,
          ticketId: ticket.id,
          read: false
        });
      }
      
      // Notify assigned agent if they didn't create the comment
      if (ticket.assignedToId && ticket.assignedToId !== comment.userId) {
        this.createNotification({
          message: `New comment on ticket #${ticket.id}`,
          type: "info",
          userId: ticket.assignedToId,
          ticketId: ticket.id,
          read: false
        });
      }
    }
    
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }

  // Notification operations
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnreadNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.read)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const notification: Notification = { 
      ...insertNotification, 
      id,
      createdAt: new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    notification.read = true;
    this.notifications.set(id, notification);
    return true;
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.read);
      
    userNotifications.forEach(notification => {
      notification.read = true;
      this.notifications.set(notification.id, notification);
    });
    
    return true;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }

  // Stats operations
  async getTicketStats(): Promise<any> {
    const tickets = Array.from(this.tickets.values());
    
    const openCount = tickets.filter(ticket => ticket.status === "open").length;
    const inProgressCount = tickets.filter(ticket => ticket.status === "in_progress").length;
    const resolvedCount = tickets.filter(ticket => ticket.status === "resolved").length;
    const closedCount = tickets.filter(ticket => ticket.status === "closed").length;
    
    const highPriorityCount = tickets.filter(ticket => ticket.priority === "high").length;
    const mediumPriorityCount = tickets.filter(ticket => ticket.priority === "medium").length;
    const lowPriorityCount = tickets.filter(ticket => ticket.priority === "low").length;
    
    // Calculate today's resolved tickets
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = tickets.filter(
      ticket => ticket.status === "resolved" && 
      ticket.updatedAt >= today
    ).length;
    
    // Calculate average response time (mock data since we don't track actual response times)
    const avgResponseTime = "3.2h";
    
    return {
      total: tickets.length,
      openTickets: openCount,
      inProgressTickets: inProgressCount,
      resolvedTickets: resolvedToday, // Showing resolved today for the dashboard
      closedTickets: closedCount,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
      avgResponseTime
    };
  }
}

export const storage = new MemStorage();
