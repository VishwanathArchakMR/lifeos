import {
  users,
  tasks,
  notes,
  focusSessions,
  contentIdeas,
  aiLogs,
  dailySummaries,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type Note,
  type InsertNote,
  type FocusSession,
  type InsertFocusSession,
  type ContentIdea,
  type InsertContentIdea,
  type AiLog,
  type InsertAiLog,
  type DailySummary,
  type InsertDailySummary,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lt } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Task operations
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: number, userId: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, userId: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number, userId: string): Promise<boolean>;

  // Note operations
  getNotes(userId: string): Promise<Note[]>;
  getNote(id: number, userId: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, userId: string, updates: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number, userId: string): Promise<boolean>;

  // Focus session operations
  getFocusSessions(userId: string): Promise<FocusSession[]>;
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;
  updateFocusSession(id: number, userId: string, updates: Partial<InsertFocusSession>): Promise<FocusSession | undefined>;

  // Content ideas operations
  getContentIdeas(userId: string): Promise<ContentIdea[]>;
  createContentIdea(idea: InsertContentIdea): Promise<ContentIdea>;
  updateContentIdea(id: number, userId: string, updates: Partial<InsertContentIdea>): Promise<ContentIdea | undefined>;
  deleteContentIdea(id: number, userId: string): Promise<boolean>;

  // AI logs operations
  createAiLog(log: InsertAiLog): Promise<AiLog>;

  // Daily summary operations
  getDailySummary(userId: string, date: Date): Promise<DailySummary | undefined>;
  createDailySummary(summary: InsertDailySummary): Promise<DailySummary>;
  getTodayStats(userId: string): Promise<{ tasksCompleted: number; totalTasks: number; focusMinutes: number; notesCreated: number }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Task operations
  async getTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number, userId: string): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await db.insert(tasks).values(task).returning();
    return created;
  }

  async updateTask(id: number, userId: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteTask(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Note operations
  async getNotes(userId: string): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.createdAt));
  }

  async getNote(id: number, userId: string): Promise<Note | undefined> {
    const [note] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));
    return note || undefined;
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [created] = await db.insert(notes).values(note).returning();
    return created;
  }

  async updateNote(id: number, userId: string, updates: Partial<InsertNote>): Promise<Note | undefined> {
    const [updated] = await db
      .update(notes)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteNote(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Focus session operations
  async getFocusSessions(userId: string): Promise<FocusSession[]> {
    return await db
      .select()
      .from(focusSessions)
      .where(eq(focusSessions.userId, userId))
      .orderBy(desc(focusSessions.startedAt));
  }

  async createFocusSession(session: InsertFocusSession): Promise<FocusSession> {
    const [created] = await db.insert(focusSessions).values(session).returning();
    return created;
  }

  async updateFocusSession(id: number, userId: string, updates: Partial<InsertFocusSession>): Promise<FocusSession | undefined> {
    const [updated] = await db
      .update(focusSessions)
      .set(updates)
      .where(and(eq(focusSessions.id, id), eq(focusSessions.userId, userId)))
      .returning();
    return updated || undefined;
  }

  // Content ideas operations
  async getContentIdeas(userId: string): Promise<ContentIdea[]> {
    return await db
      .select()
      .from(contentIdeas)
      .where(eq(contentIdeas.userId, userId))
      .orderBy(desc(contentIdeas.createdAt));
  }

  async createContentIdea(idea: InsertContentIdea): Promise<ContentIdea> {
    const [created] = await db.insert(contentIdeas).values(idea).returning();
    return created;
  }

  async updateContentIdea(id: number, userId: string, updates: Partial<InsertContentIdea>): Promise<ContentIdea | undefined> {
    const [updated] = await db
      .update(contentIdeas)
      .set(updates)
      .where(and(eq(contentIdeas.id, id), eq(contentIdeas.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteContentIdea(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(contentIdeas)
      .where(and(eq(contentIdeas.id, id), eq(contentIdeas.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // AI logs operations
  async createAiLog(log: InsertAiLog): Promise<AiLog> {
    const [created] = await db.insert(aiLogs).values(log).returning();
    return created;
  }

  // Daily summary operations
  async getDailySummary(userId: string, date: Date): Promise<DailySummary | undefined> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [summary] = await db
      .select()
      .from(dailySummaries)
      .where(
        and(
          eq(dailySummaries.userId, userId),
          gte(dailySummaries.date, startOfDay),
          lt(dailySummaries.date, endOfDay)
        )
      );
    return summary || undefined;
  }

  async createDailySummary(summary: InsertDailySummary): Promise<DailySummary> {
    const [created] = await db.insert(dailySummaries).values(summary).returning();
    return created;
  }

  async getTodayStats(userId: string): Promise<{ tasksCompleted: number; totalTasks: number; focusMinutes: number; notesCreated: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
    const todayNotes = await db
      .select()
      .from(notes)
      .where(and(eq(notes.userId, userId), gte(notes.createdAt, today)));
    const todaySessions = await db
      .select()
      .from(focusSessions)
      .where(and(eq(focusSessions.userId, userId), gte(focusSessions.startedAt, today)));

    return {
      tasksCompleted: allTasks.filter(t => t.completed).length,
      totalTasks: allTasks.length,
      focusMinutes: todaySessions.reduce((acc, s) => acc + (s.completedDuration || 0), 0),
      notesCreated: todayNotes.length,
    };
  }
}

export const storage = new DatabaseStorage();
