import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, Sparkles, Search, ExternalLink, BookOpen, 
  User, Building, Calendar, Loader2 
} from 'lucide-react';
import { searchIEEE, IEEEPaper } from '@/lib/api/papers';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const IEEESearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IEEEPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({ 
        title: 'Enter a Search Query', 
        description: 'Please enter keywords to search for papers',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchIEEE(query);
      setResults(data);
    } catch (err: any) {
      toast({ 
        title: 'Search Failed', 
        description: err.message || 'Unable to search papers',
        variant: 'destructive'
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getPaperLink = (paper: IEEEPaper) => {
    if (paper.link) return paper.link;
    if (paper.doi) return `https://doi.org/${paper.doi}`;
    return null;
  };

  const getPublishedDate = (paper: IEEEPaper) => {
    return paper.published || paper.published_date || 'N/A';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-heading">R&D Connect</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-heading">Research Paper Search</h1>
          </div>
          <p className="text-muted-foreground">
            Search millions of papers from IEEE, CrossRef, and OpenAlex databases
          </p>
        </div>

        {/* Search Form */}
        <Card className="border-0 shadow-md mb-8 animate-slide-up">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for papers, authors, topics..."
                  className="pl-10 h-12"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="h-12 px-8 gradient-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No papers found for "{query}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try different keywords or broaden your search
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.length > 0 && (
              <p className="text-muted-foreground mb-4">
                Found {results.length} paper{results.length !== 1 ? 's' : ''}
              </p>
            )}
            {results.map((paper, index) => {
              const paperLink = getPaperLink(paper);
              return (
                <Card 
                  key={`${paper.doi}-${index}`} 
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-heading leading-tight">
                      {paper.title}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {paper.authors || 'Unknown Authors'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {paper.publisher || 'Unknown Publisher'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {getPublishedDate(paper)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-3">
                      {paper.doi && (
                        <Badge variant="secondary" className="text-xs">
                          DOI: {paper.doi}
                        </Badge>
                      )}
                      {paperLink && (
                        <Button asChild variant="outline" size="sm">
                          <a href={paperLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Paper
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default IEEESearch;
