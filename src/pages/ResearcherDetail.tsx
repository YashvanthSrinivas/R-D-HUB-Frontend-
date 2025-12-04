import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, Sparkles, Building, GraduationCap, Mail, 
  FileText, Send, Loader2, CheckCircle, User
} from 'lucide-react';
import { getResearcherById, sendCollaborationRequest, ResearcherProfile } from '@/lib/api/papers';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const ResearcherDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [researcher, setResearcher] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchResearcher = async () => {
      if (!id) return;
      
      try {
        const data = await getResearcherById(parseInt(id));
        setResearcher(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load researcher');
      } finally {
        setLoading(false);
      }
    };

    fetchResearcher();
  }, [id]);

  const handleSendRequest = async () => {
    if (!user) {
      toast({ 
        title: 'Sign In Required', 
        description: 'Please sign in to send collaboration requests',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    if (!message.trim()) {
      toast({ 
        title: 'Message Required', 
        description: 'Please write a message for your collaboration request',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      await sendCollaborationRequest(parseInt(id!), message);
      setRequestSent(true);
      toast({ 
        title: 'Request Sent!', 
        description: 'Your collaboration request has been sent successfully.'
      });
    } catch (err: any) {
      toast({ 
        title: 'Failed to Send', 
        description: err.message || 'Unable to send collaboration request',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link to="/researchers" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold font-heading">R&D Connect</span>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !researcher) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link to="/researchers" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold font-heading">R&D Connect</span>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto border-destructive bg-destructive/10">
            <CardContent className="py-8 text-center">
              <p className="text-destructive">{error || 'Researcher not found'}</p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/researchers">Back to Directory</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const isOwnProfile = user && researcher.user === user.id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/researchers" className="flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-heading">R&D Connect</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Card */}
          <Card className="border-0 shadow-lg mb-8 animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-6">
                {researcher.photo ? (
                  <img 
                    src={researcher.photo} 
                    alt={researcher.full_name}
                    className="h-24 w-24 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-2xl font-heading mb-2">
                    {researcher.full_name}
                  </CardTitle>
                  <div className="space-y-1 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {researcher.institution}
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {researcher.qualifications}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {researcher.contact_email}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{researcher.bio}</p>
              
              {researcher.research_papers && (
                <div className="mt-6">
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <FileText className="h-3 w-3" />
                    Research Papers Available
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collaboration Request Card */}
          {!isOwnProfile && (
            <Card className="border-0 shadow-lg animate-slide-up">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Send Collaboration Request</CardTitle>
                <CardDescription>
                  Introduce yourself and explain why you'd like to collaborate
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requestSent ? (
                  <div className="text-center py-6">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Request Sent Successfully!</p>
                    <p className="text-muted-foreground mb-4">
                      {researcher.full_name} will review your request and respond soon.
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/collaboration">View My Requests</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Hi, I'm interested in collaborating on... My background is in... I believe we could work together on..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      disabled={sending}
                    />
                    <Button 
                      onClick={handleSendRequest} 
                      disabled={sending || !message.trim()}
                      className="gradient-primary"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Request
                        </>
                      )}
                    </Button>
                    {!user && (
                      <p className="text-sm text-muted-foreground">
                        You'll need to{' '}
                        <Link to="/auth" className="text-primary hover:underline">
                          sign in
                        </Link>{' '}
                        to send a collaboration request.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResearcherDetail;
