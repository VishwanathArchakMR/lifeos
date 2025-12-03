import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  User, 
  LogOut, 
  CheckCircle2,
  Clock,
  FileText,
  Lightbulb,
  Calendar,
  Sparkles,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import type { Task, FocusSession, Note, ContentIdea, DailySummary } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Profile() {
  const { user, isLoading: userLoading } = useAuth();
  const { toast } = useToast();

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: sessions } = useQuery<FocusSession[]>({
    queryKey: ["/api/focus-sessions"],
  });

  const { data: notes } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const { data: ideas } = useQuery<ContentIdea[]>({
    queryKey: ["/api/content-ideas"],
  });

  const { data: dailySummary, isLoading: summaryLoading } = useQuery<DailySummary>({
    queryKey: ["/api/daily-summary"],
  });

  const generateSummaryMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/ai/generate-daily-summary");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-summary"] });
      toast({ title: "Summary generated!", description: "Your daily summary is ready" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Failed to generate summary", variant: "destructive" });
    },
  });

  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const totalTasks = tasks?.length || 0;
  const totalFocusMinutes = sessions?.reduce((acc, s) => acc + (s.completedDuration || 0), 0) || 0;
  const totalNotes = notes?.length || 0;
  const totalIdeas = ideas?.length || 0;

  const userInitials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || user.email?.[0] || 'U'}`.toUpperCase()
    : 'U';

  const userName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'User'
    : 'User';

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Profile
          </h1>
          <ThemeToggle />
        </div>

        {/* User Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {userLoading ? (
                <>
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt={userName} style={{ objectFit: 'cover' }} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold" data-testid="text-user-name">{userName}</h2>
                    <p className="text-sm text-muted-foreground" data-testid="text-user-email">{user?.email}</p>
                    {user?.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Member since {format(new Date(user.createdAt), "MMMM yyyy")}
                      </p>
                    )}
                  </div>
                  <a href="/api/logout">
                    <Button variant="outline" size="sm" className="gap-2" data-testid="button-logout">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </a>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalFocusMinutes}</p>
                <p className="text-xs text-muted-foreground">Focus Minutes</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalNotes}</p>
                <p className="text-xs text-muted-foreground">Notes Created</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Lightbulb className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalIdeas}</p>
                <p className="text-xs text-muted-foreground">Content Ideas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Summary
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateSummaryMutation.mutate()}
              disabled={generateSummaryMutation.isPending}
              className="gap-2"
              data-testid="button-generate-summary"
            >
              {generateSummaryMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate
            </Button>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : dailySummary?.summary ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed">{dailySummary.summary}</p>
                <Separator />
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <p className="font-semibold text-green-500">{dailySummary.tasksCompleted}</p>
                    <p className="text-xs text-muted-foreground">Tasks Done</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500">{dailySummary.focusMinutes}</p>
                    <p className="text-xs text-muted-foreground">Focus Mins</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-500">{dailySummary.notesCreated}</p>
                    <p className="text-xs text-muted-foreground">Notes</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">No summary yet for today</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSummaryMutation.mutate()}
                  disabled={generateSummaryMutation.isPending}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Summary
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
