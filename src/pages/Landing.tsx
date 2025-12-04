import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Users, MessageSquare, Bot, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Search,
      title: 'Research Paper Search',
      description: 'Access millions of research papers from IEEE, CrossRef, and OpenAlex databases.',
    },
    {
      icon: Users,
      title: 'Researcher Directory',
      description: 'Connect with researchers worldwide and explore their publications.',
    },
    {
      icon: MessageSquare,
      title: 'Collaboration Hub',
      description: 'Send collaboration requests and build meaningful research partnerships.',
    },
    {
      icon: Bot,
      title: 'AI Research Assistant',
      description: 'Get intelligent guidance for your R&D projects with our AI assistant.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="gradient-hero text-primary-foreground">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            <span className="text-xl font-bold font-heading">R&D Connect</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button asChild variant="secondary">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
              Your Gateway to{' '}
              <span className="text-accent">Research Excellence</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Connect with researchers, discover papers, and accelerate your R&D projects 
              with AI-powered insights. All in one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-accent text-accent-foreground border-0 shadow-glow">
                <Link to={user ? '/dashboard' : '/auth'}>
                  Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/researchers">Browse Researchers</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Everything You Need for R&D
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive platform designed to streamline your research workflow 
              and foster meaningful collaborations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg gradient-card">
            <CardContent className="py-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-heading">
                Ready to Transform Your Research?
              </h3>
              <p className="text-muted-foreground mb-8">
                Join thousands of researchers and students using R&D Connect 
                to accelerate their discoveries.
              </p>
              <Button asChild size="lg" className="gradient-primary">
                <Link to="/auth">
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 R&D Connect. Empowering research collaboration worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
