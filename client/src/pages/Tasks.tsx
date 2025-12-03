import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Sparkles, 
  Calendar,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  Target
} from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

type TaskFilter = "all" | "active" | "completed";

export default function Tasks() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [aiInput, setAiInput] = useState("");
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualPriority, setManualPriority] = useState("medium");
  const [manualDueDate, setManualDueDate] = useState("");
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: { title: string; description?: string; priority?: string; dueDate?: string }) => {
      return await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task created successfully!" });
      setManualTitle("");
      setManualDescription("");
      setManualPriority("medium");
      setManualDueDate("");
      setIsManualDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", description: "Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Failed to create task", variant: "destructive" });
    },
  });

  const aiParseMutation = useMutation({
    mutationFn: async (input: string) => {
      return await apiRequest("POST", "/api/ai/parse-tasks", { input });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Tasks created with AI!", description: "Your tasks have been organized" });
      setAiInput("");
      setIsAiDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", description: "Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "AI parsing failed", description: "Please try again", variant: "destructive" });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      return await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      }
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task deleted" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      }
    },
  });

  const filteredTasks = tasks?.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }) || [];

  const activeCount = tasks?.filter(t => !t.completed).length || 0;
  const completedCount = tasks?.filter(t => t.completed).length || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Tasks
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeCount} active, {completedCount} completed
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-add-task-manual">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Task title"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    data-testid="input-task-title"
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    data-testid="input-task-description"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={manualPriority} onValueChange={setManualPriority}>
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={manualDueDate}
                      onChange={(e) => setManualDueDate(e.target.value)}
                      data-testid="input-due-date"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => createTaskMutation.mutate({
                      title: manualTitle,
                      description: manualDescription || undefined,
                      priority: manualPriority,
                      dueDate: manualDueDate || undefined,
                    })}
                    disabled={!manualTitle.trim() || createTaskMutation.isPending}
                    data-testid="button-submit-task"
                  >
                    {createTaskMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Add Task"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" data-testid="button-add-task-ai">
                  <Sparkles className="w-4 h-4" />
                  AI Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Task Parser
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Textarea
                    placeholder="Describe your tasks in natural language, e.g., 'I need to finish my essay by Friday, call mom tomorrow, and buy groceries (high priority)'"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="min-h-[120px]"
                    data-testid="input-ai-tasks"
                  />
                  <Button
                    className="w-full gap-2"
                    onClick={() => aiParseMutation.mutate(aiInput)}
                    disabled={!aiInput.trim() || aiParseMutation.isPending}
                    data-testid="button-parse-tasks"
                  >
                    {aiParseMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Parsing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Parse & Create Tasks
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as TaskFilter)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" data-testid="tab-all">
              All ({tasks?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active">
              Active ({activeCount})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed ({completedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Task List */}
        <div className="space-y-3">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card key={task.id} className={task.completed ? "opacity-60" : ""} data-testid={`task-card-${task.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed || false}
                      onCheckedChange={(checked) => 
                        toggleTaskMutation.mutate({ id: task.id, completed: checked as boolean })
                      }
                      className="mt-1"
                      data-testid={`checkbox-task-${task.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(task.dueDate), "MMM d")}
                          </span>
                        )}
                        {task.category && (
                          <span className="flex items-center gap-1">
                            #{task.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.priority && (
                        <Badge 
                          variant="secondary"
                          className={
                            task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            'bg-green-500/10 text-green-500 border-green-500/20'
                          }
                        >
                          {task.priority}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTaskMutation.mutate(task.id)}
                        data-testid={`button-delete-task-${task.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {filter === "completed" ? "No completed tasks yet" : 
                   filter === "active" ? "All caught up!" : "No tasks yet"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {filter === "all" 
                    ? "Add your first task to get started"
                    : filter === "active"
                    ? "Great job completing all your tasks!"
                    : "Complete some tasks to see them here"}
                </p>
                {filter !== "completed" && (
                  <Button onClick={() => setIsAiDialogOpen(true)} className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Add Tasks with AI
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
