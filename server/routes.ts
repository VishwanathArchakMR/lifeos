import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  parseTasksWithAI, 
  summarizeNote, 
  generateContentIdeas, 
  generateDailySummary,
  generateSchedule 
} from "./openai";
import { insertTaskSchema, insertNoteSchema, insertFocusSessionSchema, insertContentIdeaSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task routes
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertTaskSchema.parse({ ...req.body, userId });
      const task = await storage.createTask(data);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Failed to create task" });
    }
  });

  app.patch('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const task = await storage.updateTask(id, userId, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(400).json({ message: "Failed to delete task" });
    }
  });

  // Note routes
  app.get('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notes = await storage.getNotes(userId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertNoteSchema.parse({ ...req.body, userId });
      const note = await storage.createNote(data);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(400).json({ message: "Failed to create note" });
    }
  });

  app.patch('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const note = await storage.updateNote(id, userId, req.body);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(400).json({ message: "Failed to update note" });
    }
  });

  app.delete('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNote(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(400).json({ message: "Failed to delete note" });
    }
  });

  // Focus session routes
  app.get('/api/focus-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getFocusSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching focus sessions:", error);
      res.status(500).json({ message: "Failed to fetch focus sessions" });
    }
  });

  app.post('/api/focus-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertFocusSessionSchema.parse({ ...req.body, userId });
      const session = await storage.createFocusSession(data);
      res.json(session);
    } catch (error) {
      console.error("Error creating focus session:", error);
      res.status(400).json({ message: "Failed to create focus session" });
    }
  });

  // Content ideas routes
  app.get('/api/content-ideas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ideas = await storage.getContentIdeas(userId);
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching content ideas:", error);
      res.status(500).json({ message: "Failed to fetch content ideas" });
    }
  });

  app.patch('/api/content-ideas/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const idea = await storage.updateContentIdea(id, userId, req.body);
      if (!idea) {
        return res.status(404).json({ message: "Content idea not found" });
      }
      res.json(idea);
    } catch (error) {
      console.error("Error updating content idea:", error);
      res.status(400).json({ message: "Failed to update content idea" });
    }
  });

  app.delete('/api/content-ideas/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContentIdea(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Content idea not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content idea:", error);
      res.status(400).json({ message: "Failed to delete content idea" });
    }
  });

  // Daily summary route
  app.get('/api/daily-summary', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const summary = await storage.getDailySummary(userId, new Date());
      res.json(summary || null);
    } catch (error) {
      console.error("Error fetching daily summary:", error);
      res.status(500).json({ message: "Failed to fetch daily summary" });
    }
  });

  // AI routes
  app.post('/api/ai/parse-tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { input } = req.body;
      
      if (!input || typeof input !== 'string') {
        return res.status(400).json({ message: "Input is required" });
      }

      const parsedTasks = await parseTasksWithAI(input);
      
      // Log the AI action
      await storage.createAiLog({
        userId,
        actionType: 'task_parse',
        prompt: input,
        response: JSON.stringify(parsedTasks),
      });

      // Create tasks from parsed results
      const createdTasks = [];
      for (const task of parsedTasks) {
        const created = await storage.createTask({
          userId,
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        });
        createdTasks.push(created);
      }

      res.json({ tasks: createdTasks });
    } catch (error) {
      console.error("Error parsing tasks with AI:", error);
      res.status(500).json({ message: "Failed to parse tasks" });
    }
  });

  app.post('/api/ai/generate-schedule', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { freeTimeBlocks } = req.body;

      const tasks = await storage.getTasks(userId);
      const activeTasks = tasks.filter(t => !t.completed);

      const schedule = await generateSchedule(
        activeTasks.map(t => ({ title: t.title, priority: t.priority || undefined, dueDate: t.dueDate })),
        freeTimeBlocks || "9am-5pm"
      );

      await storage.createAiLog({
        userId,
        actionType: 'schedule_generate',
        prompt: freeTimeBlocks,
        response: schedule,
      });

      res.json({ schedule });
    } catch (error) {
      console.error("Error generating schedule:", error);
      res.status(500).json({ message: "Failed to generate schedule" });
    }
  });

  app.post('/api/ai/summarize-note/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);

      const note = await storage.getNote(id, userId);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const summary = await summarizeNote(note.content);

      await storage.createAiLog({
        userId,
        actionType: 'note_summarize',
        prompt: note.content.substring(0, 500),
        response: summary,
      });

      const updated = await storage.updateNote(id, userId, { summary });
      res.json(updated);
    } catch (error) {
      console.error("Error summarizing note:", error);
      res.status(500).json({ message: "Failed to summarize note" });
    }
  });

  app.post('/api/ai/generate-content-ideas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { niche, platform } = req.body;

      if (!niche || !platform) {
        return res.status(400).json({ message: "Niche and platform are required" });
      }

      const ideas = await generateContentIdeas(niche, platform);

      await storage.createAiLog({
        userId,
        actionType: 'content_generate',
        prompt: `${niche} - ${platform}`,
        response: JSON.stringify(ideas),
      });

      // Save ideas to database
      const savedIdeas = [];
      for (const idea of ideas) {
        const saved = await storage.createContentIdea({
          userId,
          platform,
          title: idea.title,
          description: idea.description,
          niche,
        });
        savedIdeas.push(saved);
      }

      res.json({ ideas: savedIdeas });
    } catch (error) {
      console.error("Error generating content ideas:", error);
      res.status(500).json({ message: "Failed to generate content ideas" });
    }
  });

  app.post('/api/ai/generate-daily-summary', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      const stats = await storage.getTodayStats(userId);
      const summary = await generateDailySummary(
        stats.tasksCompleted,
        stats.totalTasks,
        stats.focusMinutes,
        stats.notesCreated
      );

      await storage.createAiLog({
        userId,
        actionType: 'daily_summary',
        prompt: JSON.stringify(stats),
        response: summary,
      });

      const dailySummary = await storage.createDailySummary({
        userId,
        date: new Date(),
        summary,
        tasksCompleted: stats.tasksCompleted,
        focusMinutes: stats.focusMinutes,
        notesCreated: stats.notesCreated,
      });

      res.json(dailySummary);
    } catch (error) {
      console.error("Error generating daily summary:", error);
      res.status(500).json({ message: "Failed to generate daily summary" });
    }
  });

  return httpServer;
}
