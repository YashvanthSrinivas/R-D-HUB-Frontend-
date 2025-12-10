import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Sparkles,
  Bot,
  Send,
  Loader2,
  Lightbulb,
} from "lucide-react";
import {
  queryAssistant,
  AssistantAnalysis,
} from "@/lib/api/papers";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Assistant = () => {
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState<AssistantAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const exampleQueries = [
    "Build an electric vehicle prototype",
    "Drone for agricultural monitoring",
    "AI-based smart city traffic system",
    "Renewable energy storage solutions",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      toast({
        title: "Enter a Query",
        description: "Please describe your R&D project or question",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const data = await queryAssistant(query);
      setAnalysis(data);
    } catch (err: any) {
      toast({
        title: "Query Failed",
        description: err.message || "Unable to get AI response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-heading">R&D Connect</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title Section */}
        <div className="mb-8 animate-fade-in text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full gradient-primary mb-4">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold font-heading mb-2">
            AI Research Assistant
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get intelligent guidance for your R&D projects. Describe your
            project idea and receive actionable insights, timelines, and
            recommendations.
          </p>
        </div>

        {/* Example Queries */}
        <Card className="border-0 shadow-md mb-6 animate-slide-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Example Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Query Input */}
        <Card
          className="border-0 shadow-md mb-6 animate-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader>
            <CardTitle className="font-heading">Ask Your Question</CardTitle>
            <CardDescription>
              Describe your R&D project, research question, or technical
              challenge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="E.g., I want to build an autonomous drone for agricultural monitoring..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
                disabled={loading}
                className="resize-none"
              />
              <Button
                type="submit"
                className="w-full gradient-primary"
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Get AI Guidance
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Response Section */}
        {(analysis || loading) && (
          <Card className="border-0 shadow-lg animate-scale-in">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
                  <div className="h-4 bg-muted rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              ) : (
                analysis && (
                  <div className="space-y-6 text-sm">
                    {/* Overview */}
                    <section>
                      <h3 className="font-semibold mb-1">Overview</h3>
                      <p className="text-muted-foreground">
                        {analysis.overview}
                      </p>
                    </section>

                    {/* Steps */}
                    {analysis.steps?.length > 0 && (
                      <section>
                        <h3 className="font-semibold mb-1">Project Steps</h3>
                        <ol className="list-decimal ml-5 space-y-1">
                          {analysis.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </section>
                    )}

                    {/* Tools */}
                    {analysis.tools?.length > 0 && (
                      <section>
                        <h3 className="font-semibold mb-1">Tools & Technologies</h3>
                        <ul className="list-disc ml-5 space-y-1">
                          {analysis.tools.map((tool, idx) => (
                            <li key={idx}>{tool}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Timeline */}
                    <section>
                      <h3 className="font-semibold mb-1">Timeline</h3>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="border rounded-lg p-3">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Design
                          </p>
                          <p className="text-sm mt-1">
                            {analysis.timeline.design}
                          </p>
                        </div>

                        <div className="border rounded-lg p-3">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Implementation
                          </p>
                          <p className="text-sm mt-1">
                            {analysis.timeline.implementation}
                          </p>
                        </div>

                        <div className="border rounded-lg p-3">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            MVP
                          </p>
                          <p className="text-sm mt-1">{analysis.timeline.mvp}</p>
                        </div>
                      </div>
                    </section>

                    {/* Competitors */}
                    {analysis.competitors?.length > 0 && (
                      <section>
                        <h3 className="font-semibold mb-1">
                          Competitor Analysis
                        </h3>
                        <ul className="list-disc ml-5 space-y-1">
                          {analysis.competitors.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Risks */}
                    {analysis.risks?.length > 0 && (
                      <section>
                        <h3 className="font-semibold mb-1">Risks</h3>
                        <ul className="list-disc ml-5 space-y-1">
                          {analysis.risks.map((risk, idx) => (
                            <li key={idx}>{risk}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Strategies */}
                    {analysis.strategies?.length > 0 && (
                      <section>
                        <h3 className="font-semibold mb-1">Strategies</h3>
                        <ul className="list-disc ml-5 space-y-1">
                          {analysis.strategies.map((strategy, idx) => (
                            <li key={idx}>{strategy}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Summary */}
                    <section>
                      <h3 className="font-semibold mb-1">Summary</h3>
                      <p className="text-muted-foreground">{analysis.summary}</p>
                    </section>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Assistant;
