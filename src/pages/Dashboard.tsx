import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Search, Users, MessageSquare, Bot, LogOut, Sparkles, 
  AlertTriangle, User, Mail, ChevronRight 
} from 'lucide-react';
import { getResearchers, ResearcherProfile } from '@/lib/api/papers';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (user?.is_researcher) {
        try {
          const researchers = await getResearchers();
          const userProfile = researchers.find((r: ResearcherProfile) => r.user === user.id);
          setHasProfile(!!userProfile);
        } catch (error) {
          console.error('Failed to check profile:', error);
          setHasProfile(false);
        }
      }
      setLoading(false);
    };

    checkProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const quickLinks = [
    {
      icon: Users,
      title: 'Researcher Directory',
      description: 'Explore researchers and their work',
      href: '/researchers',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Search,
      title: 'IEEE Paper Search',
      description: 'Search millions of research papers',
      href: '/ieee-search',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: MessageSquare,
      title: 'Collaborations',
      description: 'Manage your collaboration requests',
      href: '/collaboration',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get AI-powered R&D guidance',
      href: '/assistant',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-heading">R&D Connect</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/researchers" className="text-muted-foreground hover:text-foreground transition-colors">
                Researchers
              </Link>
              <Link to="/ieee-search" className="text-muted-foreground hover:text-foreground transition-colors">
                Papers
              </Link>
              <Link to="/collaboration" className="text-muted-foreground hover:text-foreground transition-colors">
                Collaboration
              </Link>
              <Link to="/assistant" className="text-muted-foreground hover:text-foreground transition-colors">
                AI Assistant
              </Link>
            </nav>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 font-heading">
            Welcome back, {user?.username}!
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {user?.is_researcher ? 'Researcher' : 'Student'}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {user?.email}
            </span>
          </div>
        </div>

        {/* Profile Warning for Researchers */}
        {user?.is_researcher && !loading && hasProfile === false && (
          <Alert className="mb-8 border-warning bg-warning/10 animate-slide-up">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Complete Your Profile</AlertTitle>
            <AlertDescription className="mt-2">
              You haven't created your researcher profile yet. Create one to be discoverable 
              by other users and receive collaboration requests.
              <Button asChild className="mt-4 block w-fit" size="sm">
                <Link to="/create-profile">
                  Create Profile <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Links Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <Link 
              key={link.href} 
              to={link.href}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <link.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors">
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats or Additional Info */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4 font-heading">Getting Started</h2>
          <Card className="border-0 shadow-md">
            <CardContent className="py-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">1</div>
                  <p className="text-muted-foreground">Search for papers in your field</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">2</div>
                  <p className="text-muted-foreground">Find researchers to collaborate with</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">3</div>
                  <p className="text-muted-foreground">Use AI assistant for project guidance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
