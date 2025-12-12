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

import { queryAssistant } from "@/lib/api/papers";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

/* -----------------------------------------
   SAFE DEFAULT STRUCTURE
------------------------------------------ */
const SAFE_DEFAULT = {
  overview: "",
  steps: [] as string[],
  tools: [] as string[],
  timeline: {
    design: "",
    implementation: "",
    mvp: "",
  },
  competitors: [] as string[],
  strategies: [] as string[],
  summary: "",
};

const Assistant = () => {
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState(SAFE_DEFAULT);
  const [loading, setLoading] = useState(false);

  const exampleQueries = [
    "Build an electric vehicle prototype",
    "Drone for agricultural monitoring",
    "AI-based smart city traffic system",
    "Renewable energy storage solutions",
  ];

  /* -----------------------------------------
     HANDLE FORM SUBMIT
  ------------------------------------------ */
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

    try {
      const result = await queryAssistant(query);

      let payload: any = {};

      try {
        // Backend already sends JSON object
        if (typeof result.response === "object") {
          payload = result.response;
        } else {
          payload = JSON.parse(result.response || "{}");
        }
      } catch {
        payload = {};
      }

      const safe = {
        ...SAFE_DEFAULT,
        ...payload,
        timeline: {
          ...SAFE_DEFAULT.timeline,
          ...(payload.timeline || {}),
        },
      };

      setAnalysis(safe);
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

  const handleExampleClick = (example: string) => setQuery(example);

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
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
        {/* TITLE */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full gradient-primary mb-4">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AI Research Assistant</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get intelligent guidance for your R&D projects.
          </p>
        </div>

        {/* EXAMPLE QUERIES */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Example Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* INPUT FORM */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader>
            <CardTitle>Ask Your Question</CardTitle>
            <CardDescription>
              Describe your R&D project or technical challenge.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., Build an EV prototype…"
                rows={4}
                disabled={loading}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Send />}
                &nbsp; Get AI Guidance
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* AI RESPONSE */}
        {!loading && analysis.overview && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Response
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-sm">

              {/* Overview */}
              <section>
                <h3 className="font-semibold mb-1">Overview</h3>
                <p>{analysis.overview}</p>
              </section>

              {/* Steps */}
              {analysis.steps.length > 0 && (
                <section>
                  <h3 className="font-semibold mb-1">Steps</h3>
                  <ol className="list-decimal ml-5">
                    {analysis.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Tools */}
              {analysis.tools.length > 0 && (
                <section>
                  <h3 className="font-semibold mb-1">Tools & Technologies</h3>
                  <ul className="list-disc ml-5">
                    {analysis.tools.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Competitors */}
              {analysis.competitors.length > 0 && (
                <section>
                  <h3 className="font-semibold mb-1">Competitor Analysis</h3>
                  <ul className="list-disc ml-5">
                    {analysis.competitors.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Strategies */}
              {analysis.strategies.length > 0 && (
                <section>
                  <h3 className="font-semibold mb-1">Strategies</h3>
                  <ul className="list-disc ml-5">
                    {analysis.strategies.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Timeline */}
              <section>
                <h3 className="font-semibold mb-1">Timeline</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="border p-3 rounded">
                    <p className="text-xs text-muted-foreground">Design</p>
                    <p>{analysis.timeline.design}</p>
                  </div>

                  <div className="border p-3 rounded">
                    <p className="text-xs text-muted-foreground">Implementation</p>
                    <p>{analysis.timeline.implementation}</p>
                  </div>

                  <div className="border p-3 rounded">
                    <p className="text-xs text-muted-foreground">MVP</p>
                    <p>{analysis.timeline.mvp}</p>
                  </div>
                </div>
              </section>

              {/* Summary */}
              <section>
                <h3 className="font-semibold mb-1">Summary</h3>
                <p>{analysis.summary}</p>
              </section>

            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Assistant;
