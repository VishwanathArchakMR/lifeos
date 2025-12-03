import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Brain, 
  Timer, 
  Sparkles, 
  FileText, 
  Video,
  ArrowRight,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Task Manager",
    description: "Convert natural language into organized tasks with AI-powered parsing"
  },
  {
    icon: Timer,
    title: "Deep Focus Mode",
    description: "25-minute Pomodoro sessions to maximize your productivity"
  },
  {
    icon: FileText,
    title: "Smart Notes",
    description: "Take notes and let AI summarize key points instantly"
  },
  {
    icon: Video,
    title: "Content Planner",
    description: "Generate ideas for YouTube, Shorts, and Reels with AI"
  },
  {
    icon: Target,
    title: "Daily Planning",
    description: "AI-powered schedule optimization for your free time"
  },
  {
    icon: TrendingUp,
    title: "Daily Summaries",
    description: "Get AI-generated recaps of your accomplishments"
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            {/* Logo and Badge */}
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Personal OS</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Life,{" "}
                <span className="gradient-text">Intelligently</span>
                <br />
                Organized
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                AI Life OS combines task management, scheduling, notes, and content planning
                into one powerful platform designed for students and creators.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/api/login">
                <Button size="lg" className="gap-2 text-base px-8" data-testid="button-get-started">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Instant setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A complete suite of AI-powered tools to manage your life, boost productivity, and create content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border border-border/50 card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to transform your productivity?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join students and creators who are already using AI Life OS to organize their lives.
          </p>
          <a href="/api/login">
            <Button size="lg" className="gap-2" data-testid="button-start-now">
              Start Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
