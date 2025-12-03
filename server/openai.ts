import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ParsedTask {
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  category?: string;
  dueDate?: string;
}

export async function parseTasksWithAI(input: string): Promise<ParsedTask[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are a task parsing assistant. Parse the user's natural language input into structured tasks.
        Extract:
        - title: the main task description (keep it concise)
        - description: additional details if any
        - priority: "high", "medium", or "low" based on urgency words or context
        - category: infer a category if possible (work, personal, health, education, etc.)
        - dueDate: if a date/time is mentioned, convert to ISO format (YYYY-MM-DD)
        
        Return a JSON array of tasks. Respond ONLY with valid JSON, no other text.`
      },
      {
        role: "user",
        content: input
      }
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 1024,
  });

  const result = JSON.parse(response.choices[0].message.content || '{"tasks": []}');
  return result.tasks || [];
}

export async function generateSchedule(tasks: { title: string; priority?: string; dueDate?: Date | null }[], freeTimeBlocks: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are a productivity coach and schedule optimizer. Given a list of tasks and available time blocks, 
        create an optimized daily schedule. Consider:
        - Task priorities
        - Due dates
        - Energy levels throughout the day
        - Include breaks
        
        Format the schedule clearly with times and tasks.`
      },
      {
        role: "user",
        content: `Tasks: ${JSON.stringify(tasks)}\n\nAvailable time: ${freeTimeBlocks}`
      }
    ],
    max_completion_tokens: 1024,
  });

  return response.choices[0].message.content || "Unable to generate schedule.";
}

export async function summarizeNote(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are a note summarization expert. Create a concise summary of the provided note that:
        - Captures the key points
        - Maintains important details
        - Is easy to scan quickly
        - Uses bullet points for clarity
        
        Keep the summary under 150 words.`
      },
      {
        role: "user",
        content: content
      }
    ],
    max_completion_tokens: 512,
  });

  return response.choices[0].message.content || "Unable to summarize note.";
}

export interface ContentIdea {
  title: string;
  description: string;
}

export async function generateContentIdeas(niche: string, platform: string): Promise<ContentIdea[]> {
  const platformGuidance = {
    youtube: "longer-form video content (8-20 minutes), tutorials, reviews, vlogs",
    shorts: "short vertical videos (under 60 seconds), quick tips, hooks, trends",
    reels: "engaging vertical content (15-90 seconds), trends, entertainment, lifestyle"
  };

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are a content strategist specializing in ${platform}. Generate creative, engaging content ideas for the given niche.
        Platform focus: ${platformGuidance[platform as keyof typeof platformGuidance] || "video content"}
        
        For each idea provide:
        - title: catchy, click-worthy title
        - description: brief description of the content and why it would perform well
        
        Generate 5 unique ideas. Return as JSON with a "ideas" array.`
      },
      {
        role: "user",
        content: `Niche: ${niche}`
      }
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 1024,
  });

  const result = JSON.parse(response.choices[0].message.content || '{"ideas": []}');
  return result.ideas || [];
}

export async function generateDailySummary(
  tasksCompleted: number,
  totalTasks: number,
  focusMinutes: number,
  notesCreated: number
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are an encouraging productivity coach. Create a personalized, motivational daily summary based on the user's accomplishments.
        
        Be:
        - Encouraging and positive
        - Specific about achievements
        - Provide actionable suggestions for tomorrow
        - Keep it concise (2-3 sentences)
        
        Don't be overly cheesy, be genuine and supportive.`
      },
      {
        role: "user",
        content: `Today's stats:
        - Tasks completed: ${tasksCompleted} out of ${totalTasks}
        - Focus time: ${focusMinutes} minutes
        - Notes created: ${notesCreated}`
      }
    ],
    max_completion_tokens: 256,
  });

  return response.choices[0].message.content || "Great work today! Keep pushing forward.";
}
