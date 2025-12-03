import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Target,
  Flame,
  Calendar,
  Timer,
  Lightbulb
} from "lucide-react";
import { format } from "date-fns";
import type { Task, FocusSession, Note } from "@shared/schema";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const motivationalQuotes = [
  "The secret of getting ahead is getting started.",
  "Focus on progress, not perfection.",
  "Small steps lead to big achievements.",
  "Your future is created by what you do today.",
  "Every accomplishment starts with the decision to try.",
];

export default function Dashboard() {
  const { user } = useAuth();
  const today = format(new Date(), "EEEE, MMMM d");
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: focusSessions, isLoading: focusLoading } = useQuery<FocusSession[]>({
    queryKey: ["/api/focus-sessions"],
  });

  const { data: notes, isLoading: notesLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const activeTasks = tasks?.filter(t => !t.completed).length || 0;
  const totalFocusMinutes = focusSessions?.reduce((acc, s) => acc + (s.completedDuration || 0), 0) || 0;
  const notesCount = notes?.length || 0;

  const upcomingTasks = tasks
    ?.filter(t => !t.completed)
    .slice(0, 5) || [];

  const userName = user?.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Greeting Card */}
        <Card className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">{today}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {getGreeting()}, {userName}! <span className="inline-block">👋</span>
            </h1>
            <p className="text-muted-foreground italic flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              "{randomQuote}"
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              {tasksLoading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
              ) : (
                <p className="text-3xl font-bold text-primary" data-testid="text-active-tasks">{activeTasks}</p>
              )}
              <p className="text-xs text-muted-foreground">Active Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {tasksLoading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
              ) : (
                <p className="text-3xl font-bold text-green-500" data-testid="text-completed-tasks">{completedTasks}</p>
              )}
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {focusLoading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
              ) : (
                <p className="text-3xl font-bold text-orange-500" data-testid="text-focus-minutes">{totalFocusMinutes}</p>
              )}
              <p className="text-xs text-muted-foreground">Focus Mins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {notesLoading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
              ) : (
                <p className="text-3xl font-bold text-blue-500" data-testid="text-notes-count">{notesCount}</p>
              )}
              <p className="text-xs text-muted-foreground">Notes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/focus">
            <Card className="cursor-pointer card-hover border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Start Focus</p>
                  <p className="text-xs text-muted-foreground">25 min session</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/tasks">
            <Card className="cursor-pointer card-hover border-green-500/20 bg-green-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Add Task</p>
                  <p className="text-xs text-muted-foreground">With AI parsing</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Upcoming Tasks
            </CardTitle>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))
            ) : upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover-elevate" data-testid={`task-item-${task.id}`}>
                  <div className="w-5 h-5 rounded border-2 border-muted-foreground/30" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(task.dueDate), "MMM d")}
                      </p>
                    )}
                  </div>
                  {task.priority && (
                    <Badge 
                      variant="secondary" 
                      className={
                        task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-green-500/10 text-green-500'
                      }
                    >
                      {task.priority}
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No tasks yet</p>
                <Link href="/tasks">
                  <Button variant="outline" size="sm" className="mt-3">
                    Add Your First Task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/notes">
            <Card className="cursor-pointer card-hover">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Notes</p>
                  <p className="text-xs text-muted-foreground">{notesCount} notes</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/content">
            <Card className="cursor-pointer card-hover">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Content Ideas</p>
                  <p className="text-xs text-muted-foreground">AI-generated</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
