import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, Sparkles, MessageSquare, Send, Inbox, 
  CheckCircle, XCircle, Clock, Loader2, User
} from 'lucide-react';
import { 
  getSentRequests, getReceivedRequests, updateCollaborationStatus, 
  CollaborationRequest 
} from '@/lib/api/papers';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Collaboration = () => {
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState<CollaborationRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [sent, received] = await Promise.all([
        getSentRequests(),
        user?.is_researcher ? getReceivedRequests() : Promise.resolve([])
      ]);
      setSentRequests(sent);
      setReceivedRequests(received);
    } catch (err: any) {
      toast({ 
        title: 'Failed to Load', 
        description: err.message || 'Unable to load collaboration requests',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: 'accepted' | 'rejected') => {
    setUpdating(id);
    try {
      await updateCollaborationStatus(id, status);
      toast({ 
        title: status === 'accepted' ? 'Request Accepted' : 'Request Rejected',
        description: `Collaboration request has been ${status}.`
      });
      fetchRequests();
    } catch (err: any) {
      toast({ 
        title: 'Update Failed', 
        description: err.message || 'Unable to update request status',
        variant: 'destructive'
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const RequestCard = ({ 
    request, 
    type 
  }: { 
    request: CollaborationRequest; 
    type: 'sent' | 'received' 
  }) => (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">
                {type === 'sent' 
                  ? request.to_researcher_name || `Researcher #${request.to_researcher}`
                  : request.from_user_username || `User #${request.from_user}`
                }
              </CardTitle>
              <CardDescription className="text-xs">
                {new Date(request.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
          {request.message}
        </p>
        
        {type === 'received' && request.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => handleUpdateStatus(request.id, 'accepted')}
              disabled={updating === request.id}
              className="bg-green-600 hover:bg-green-700"
            >
              {updating === request.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleUpdateStatus(request.id, 'rejected')}
              disabled={updating === request.id}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {updating === request.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
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
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-heading">Collaboration Hub</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your collaboration requests and build research partnerships
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sent" className="animate-slide-up">
          <TabsList className="mb-6">
            <TabsTrigger value="sent" className="gap-2">
              <Send className="h-4 w-4" />
              Sent Requests
              {sentRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">{sentRequests.length}</Badge>
              )}
            </TabsTrigger>
            {user?.is_researcher && (
              <TabsTrigger value="received" className="gap-2">
                <Inbox className="h-4 w-4" />
                Received Requests
                {receivedRequests.filter(r => r.status === 'pending').length > 0 && (
                  <Badge className="ml-1 bg-primary">
                    {receivedRequests.filter(r => r.status === 'pending').length}
                  </Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="sent">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-0 shadow-md">
                    <CardHeader>
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sentRequests.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="py-12 text-center">
                  <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">No sent requests yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Visit the{' '}
                    <Link to="/researchers" className="text-primary hover:underline">
                      researcher directory
                    </Link>{' '}
                    to find collaborators
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sentRequests.map((request) => (
                  <RequestCard key={request.id} request={request} type="sent" />
                ))}
              </div>
            )}
          </TabsContent>

          {user?.is_researcher && (
            <TabsContent value="received">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-0 shadow-md">
                      <CardHeader>
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/4" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : receivedRequests.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="py-12 text-center">
                    <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">No received requests yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete your profile to receive collaboration requests
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {receivedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} type="received" />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Collaboration;
