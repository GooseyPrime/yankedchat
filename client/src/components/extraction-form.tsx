import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Crown, User, ShieldCheck, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import AuthModal from "./auth-modal";

const extractionSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  exportFormat: z.enum(["json", "markdown", "text", "pdf"]),
});

type ExtractionFormData = z.infer<typeof extractionSchema>;

export default function ExtractionForm() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ExtractionFormData>({
    resolver: zodResolver(extractionSchema),
    defaultValues: {
      url: "",
      exportFormat: "json",
    },
  });

  const extractMutation = useMutation({
    mutationFn: async (data: ExtractionFormData) => {
      // Auto-detect platform from URL
      const platform = detectPlatform(data.url);
      const payload = { ...data, platform };
      const response = await apiRequest("POST", "/api/extract", payload);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setIsExtracting(false);
      setProgress(100);
      toast({
        title: "Extraction Complete",
        description: `Successfully extracted ${data.messageCount} messages`,
      });
    },
    onError: (error) => {
      setIsExtracting(false);
      setProgress(0);
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ExtractionFormData) => {
    setIsExtracting(true);
    setProgress(10);
    setResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    extractMutation.mutate(data);
  };

  const detectPlatform = (url: string): string => {
    if (url.includes("chatgpt.com") || url.includes("chat.openai.com")) return "chatgpt";
    if (url.includes("claude.ai")) return "claude";
    if (url.includes("gemini.google.com") || url.includes("bard.google.com")) return "gemini";
    if (url.includes("copilot.microsoft.com") || url.includes("bing.com/chat")) return "copilot";
    return "chatgpt"; // Default fallback
  };

  const handleUrlChange = (url: string) => {
    form.setValue("url", url);
  };

  const downloadContent = () => {
    if (!result) return;

    let mimeType: string;
    let fileExtension: string;
    let blobData: string | Uint8Array;
    
    switch (result.format) {
      case "json":
        mimeType = "application/json";
        fileExtension = "json";
        blobData = result.content;
        break;
      case "pdf":
        mimeType = "application/pdf";
        fileExtension = "pdf";
        // Convert base64 to binary for PDF
        const binaryString = atob(result.content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        blobData = bytes;
        break;
      case "markdown":
        mimeType = "text/markdown";
        fileExtension = "md";
        blobData = result.content;
        break;
      default:
        mimeType = "text/plain";
        fileExtension = "txt";
        blobData = result.content;
    }

    const blob = new Blob([blobData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* User Status Card */}
      {user ? (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200" data-testid="text-logged-in-user">
                    Welcome back, {user.username}
                  </span>
                </div>
                <Badge 
                  className={`${user.plan === 'free' ? 'bg-gray-500' : user.plan === 'pro' ? 'bg-yellow-500' : 'bg-purple-500'} text-white`}
                  data-testid="badge-user-plan"
                >
                  {user.plan === 'free' && <User className="h-3 w-3 mr-1" />}
                  {(user.plan === 'pro' || user.plan === 'premium') && <Crown className="h-3 w-3 mr-1" />}
                  {(user.plan || 'free').toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Authenticated</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-800 dark:text-orange-200">
                  You're using Yanked.Chat as a guest
                </span>
                <Badge className="bg-orange-500 text-white" data-testid="badge-guest-plan">
                  <Zap className="h-3 w-3 mr-1" />
                  GUEST
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
                data-testid="button-signin-prompt"
              >
                Sign In for More Features
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="https://chatgpt.com/c/your-conversation-id"
                        {...field}
                        data-testid="input-conversation-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="exportFormat"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-28" data-testid="select-format">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <Button
              type="submit"
              className="flame-gradient text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap px-6"
              disabled={isExtracting}
              data-testid="button-extract"
            >
              {isExtracting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Extract Chat
            </Button>
          </div>
        </form>
      </Form>

      {/* Progress Indicator */}
      {isExtracting && (
        <div className="mt-6" data-testid="extraction-progress">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Parsing conversation...</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Results Preview */}
      {result && (
        <div className="mt-6 bg-muted/30 rounded-lg p-6" data-testid="extraction-results">
          <h4 className="font-semibold text-foreground mb-4">Extracted Content Preview</h4>
          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="font-medium text-muted-foreground w-16">Status:</span>
              <span className="text-green-600 font-medium">{result.status}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-muted-foreground w-16">Messages:</span>
              <span className="text-foreground">{result.messageCount} extracted</span>
            </div>
            <div className="flex">
              <span className="font-medium text-muted-foreground w-16">Format:</span>
              <span className="text-foreground">{result.format?.toUpperCase()}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={downloadContent}
              className="text-primary hover:text-primary/80 transition-colors"
              variant="ghost"
              data-testid="button-download-result"
            >
              <Download className="mr-1 h-4 w-4" />
              Download {result.format?.toUpperCase()}
            </Button>
          </div>
        </div>
      )}

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
