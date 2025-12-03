import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Sparkles, 
  Lightbulb,
  Video,
  Smartphone,
  Film,
  Loader2,
  BookmarkPlus,
  Bookmark,
  Trash2,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import type { ContentIdea } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

type Platform = "youtube" | "shorts" | "reels";

const platformConfig = {
  youtube: { icon: Video, label: "YouTube", color: "text-red-500", bg: "bg-red-500/10" },
  shorts: { icon: Smartphone, label: "Shorts", color: "text-orange-500", bg: "bg-orange-500/10" },
  reels: { icon: Film, label: "Reels", color: "text-pink-500", bg: "bg-pink-500/10" },
};

export default function Content() {
  const { toast } = useToast();
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");

  const { data: ideas, isLoading } = useQuery<ContentIdea[]>({
    queryKey: ["/api/content-ideas"],
  });

  const generateIdeasMutation = useMutation({
    mutationFn: async (data: { niche: string; platform: string }) => {
      return await apiRequest("POST", "/api/ai/generate-content-ideas", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-ideas"] });
      toast({ title: "Ideas generated!", description: "AI has created new content ideas for you" });
      setNiche("");
      setIsGenerateOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Failed to generate ideas", variant: "destructive" });
    },
  });

  const toggleSaveMutation = useMutation({
    mutationFn: async ({ id, saved }: { id: number; saved: boolean }) => {
      return await apiRequest("PATCH", `/api/content-ideas/${id}`, { saved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-ideas"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      }
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/content-ideas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-ideas"] });
      toast({ title: "Idea deleted" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      }
    },
  });

  const filteredIdeas = ideas?.filter(idea => {
    if (activeTab === "saved") return idea.saved;
    return true;
  }) || [];

  const savedCount = ideas?.filter(i => i.saved).length || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              Content Ideas
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered ideas for YouTube, Shorts & Reels
            </p>
          </div>
          <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-generate-ideas">
                <Sparkles className="w-4 h-4" />
                Generate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Generate Content Ideas
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Niche or Topic</label>
                  <Input
                    placeholder="e.g., Tech reviews, Cooking, Fitness, Gaming..."
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    data-testid="input-niche"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(platformConfig) as Platform[]).map((p) => {
                      const config = platformConfig[p];
                      const Icon = config.icon;
                      return (
                        <Button
                          key={p}
                          variant={platform === p ? "default" : "outline"}
                          className="gap-2"
                          onClick={() => setPlatform(p)}
                          data-testid={`button-platform-${p}`}
                        >
                          <Icon className="w-4 h-4" />
                          {config.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={() => generateIdeasMutation.mutate({ niche, platform })}
                  disabled={!niche.trim() || generateIdeasMutation.isPending}
                  data-testid="button-submit-generate"
                >
                  {generateIdeasMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Ideas
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "saved")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all" data-testid="tab-all-ideas">
              All Ideas ({ideas?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="saved" data-testid="tab-saved-ideas">
              Saved ({savedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Ideas Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIdeas.map((idea) => {
              const config = platformConfig[idea.platform as Platform] || platformConfig.youtube;
              const Icon = config.icon;
              
              return (
                <Card key={idea.id} className="card-hover" data-testid={`idea-card-${idea.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Badge variant="secondary" className={`${config.bg} ${config.color}`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleSaveMutation.mutate({ id: idea.id, saved: !idea.saved })}
                          data-testid={`button-save-idea-${idea.id}`}
                        >
                          {idea.saved ? (
                            <Bookmark className="w-4 h-4 text-primary fill-primary" />
                          ) : (
                            <BookmarkPlus className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteIdeaMutation.mutate(idea.id)}
                          data-testid={`button-delete-idea-${idea.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{idea.title}</h3>
                    {idea.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {idea.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {idea.niche && (
                        <span>#{idea.niche}</span>
                      )}
                      <span>
                        {idea.createdAt && format(new Date(idea.createdAt), "MMM d")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Lightbulb className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {activeTab === "saved" ? "No saved ideas yet" : "No content ideas yet"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === "saved" 
                  ? "Save ideas you like to find them here"
                  : "Generate AI-powered content ideas for your niche"}
              </p>
              {activeTab !== "saved" && (
                <Button onClick={() => setIsGenerateOpen(true)} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Your First Ideas
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
