import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw,
  Clock,
  Flame,
  CheckCircle2,
  Timer
} from "lucide-react";
import { format } from "date-fns";
import type { FocusSession } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

type SessionState = "idle" | "focus" | "break";

export default function Focus() {
  const { toast } = useToast();
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const { data: sessions, isLoading } = useQuery<FocusSession[]>({
    queryKey: ["/api/focus-sessions"],
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: { duration: number; completedDuration: number; completed: boolean }) => {
      return await apiRequest("POST", "/api/focus-sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/focus-sessions"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      }
    },
  });

  const totalFocusMinutes = sessions?.reduce((acc, s) => acc + (s.completedDuration || 0), 0) || 0;
  const completedSessions = sessions?.filter(s => s.completed).length || 0;
  const todaySessions = sessions?.filter(s => {
    if (!s.startedAt) return false;
    const today = new Date();
    const sessionDate = new Date(s.startedAt);
    return sessionDate.toDateString() === today.toDateString();
  }) || [];
  const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.completedDuration || 0), 0);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (sessionState === "focus") {
        // Focus session completed
        const focusedMinutes = Math.round(FOCUS_DURATION / 60);
        createSessionMutation.mutate({
          duration: FOCUS_DURATION / 60,
          completedDuration: focusedMinutes,
          completed: true,
        });
        toast({
          title: "Focus session complete! 🎉",
          description: "Great work! Take a 5-minute break.",
        });
        setSessionState("break");
        setTimeLeft(BREAK_DURATION);
        setIsRunning(false);
      } else if (sessionState === "break") {
        toast({
          title: "Break over!",
          description: "Ready for another focus session?",
        });
        setSessionState("idle");
        setTimeLeft(FOCUS_DURATION);
        setIsRunning(false);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, sessionState]);

  const startFocus = () => {
    setSessionState("focus");
    setTimeLeft(FOCUS_DURATION);
    setIsRunning(true);
    startTimeRef.current = new Date();
    toast({
      title: "Focus session started",
      description: "Stay focused for 25 minutes!",
    });
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const resetSession = () => {
    // Save partial progress if in focus mode
    if (sessionState === "focus" && startTimeRef.current) {
      const elapsedSeconds = FOCUS_DURATION - timeLeft;
      const elapsedMinutes = Math.round(elapsedSeconds / 60);
      if (elapsedMinutes > 0) {
        createSessionMutation.mutate({
          duration: FOCUS_DURATION / 60,
          completedDuration: elapsedMinutes,
          completed: false,
        });
      }
    }
    
    setSessionState("idle");
    setTimeLeft(FOCUS_DURATION);
    setIsRunning(false);
    startTimeRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = sessionState === "focus" 
    ? ((FOCUS_DURATION - timeLeft) / FOCUS_DURATION) * 100
    : sessionState === "break"
    ? ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Timer className="w-6 h-6 text-primary" />
            Deep Focus Mode
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            25-minute focused work sessions
          </p>
        </div>

        {/* Timer Card */}
        <Card className={`relative overflow-hidden ${sessionState === "focus" ? "border-primary/50" : sessionState === "break" ? "border-green-500/50" : ""}`}>
          <div className={`absolute inset-0 ${sessionState === "focus" ? "bg-primary/5" : sessionState === "break" ? "bg-green-500/5" : ""}`} />
          <CardContent className="relative p-8 text-center">
            {/* Session State Badge */}
            <Badge 
              variant="secondary" 
              className={`mb-6 ${
                sessionState === "focus" ? "bg-primary/10 text-primary" :
                sessionState === "break" ? "bg-green-500/10 text-green-500" :
                ""
              }`}
            >
              {sessionState === "focus" ? "Focus Session" :
               sessionState === "break" ? "Break Time" :
               "Ready to Focus"}
            </Badge>

            {/* Timer Display */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${
                    sessionState === "focus" ? "text-primary" :
                    sessionState === "break" ? "text-green-500" :
                    "text-muted"
                  }`}
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold tabular-nums" data-testid="text-timer">
                  {formatTime(timeLeft)}
                </span>
                {sessionState !== "idle" && (
                  <span className="text-sm text-muted-foreground mt-2">
                    {sessionState === "focus" ? "Stay focused!" : "Relax and breathe"}
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {sessionState === "idle" ? (
                <Button 
                  size="lg" 
                  onClick={startFocus} 
                  className="gap-2 px-8"
                  data-testid="button-start-focus"
                >
                  <Play className="w-5 h-5" />
                  Start Focus
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={resetSession}
                    data-testid="button-reset"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={togglePause}
                    className="gap-2 px-8"
                    data-testid="button-pause"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Resume
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold" data-testid="text-today-minutes">{todayMinutes}</p>
              <p className="text-xs text-muted-foreground">Minutes Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold" data-testid="text-total-minutes">{totalFocusMinutes}</p>
              <p className="text-xs text-muted-foreground">Total Minutes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold" data-testid="text-completed-sessions">{completedSessions}</p>
              <p className="text-xs text-muted-foreground">Sessions Done</p>
            </CardContent>
          </Card>
        </div>

        {/* Session History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.slice(0, 10).map((session) => (
                  <div 
                    key={session.id} 
                    className="flex items-center gap-3 p-2 rounded-lg hover-elevate"
                    data-testid={`session-item-${session.id}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      session.completed ? "bg-green-500/10" : "bg-muted"
                    }`}>
                      {session.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {session.completedDuration} min {session.completed ? "completed" : "partial"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.startedAt && format(new Date(session.startedAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <Badge variant={session.completed ? "default" : "secondary"}>
                      {session.completed ? "Complete" : "Partial"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Timer className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No focus sessions yet</p>
                <p className="text-xs text-muted-foreground">Start your first session above!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
