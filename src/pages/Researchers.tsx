import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Sparkles, Users, Building, GraduationCap, ArrowLeft } from 'lucide-react';
import { getResearchers, ResearcherProfile } from '@/lib/api/papers';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Researchers = () => {
  const [researchers, setResearchers] = useState<ResearcherProfile[]>([]);
  const [filteredResearchers, setFilteredResearchers] = useState<ResearcherProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const data = await getResearchers();
        setResearchers(data);
        setFilteredResearchers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load researchers');
      } finally {
        setLoading(false);
      }
    };

    fetchResearchers();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = researchers.filter(
      (r) =>
        r.full_name.toLowerCase().includes(query) ||
        r.institution.toLowerCase().includes(query) ||
        r.qualifications.toLowerCase().includes(query)
    );
    setFilteredResearchers(filtered);
  }, [searchQuery, researchers]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-heading">R&D Connect</span>
          </Link>
          {!user && (
            <Button asChild variant="outline">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-heading">Researcher Directory</h1>
          </div>
          <p className="text-muted-foreground">
            Discover researchers and connect for potential collaborations
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl animate-slide-up">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, institution, or qualifications..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : error ? (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="py-8 text-center">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : filteredResearchers.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchQuery ? 'No researchers found matching your search' : 'No researchers available yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResearchers.map((researcher, index) => (
              <Link 
                key={researcher.id} 
                to={`/researchers/${researcher.id}`}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors">
                          {researcher.full_name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Building className="h-3 w-3" />
                          {researcher.institution}
                        </CardDescription>
                      </div>
                      {researcher.photo && (
                        <img 
                          src={researcher.photo} 
                          alt={researcher.full_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <GraduationCap className="h-4 w-4" />
                      <span className="line-clamp-1">{researcher.qualifications}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {researcher.bio}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      View Profile
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Researchers;
