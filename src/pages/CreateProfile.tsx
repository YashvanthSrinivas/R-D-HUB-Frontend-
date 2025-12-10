import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ArrowLeft, Sparkles, Loader2, User, FileUp } from 'lucide-react';
import { createResearcherProfile } from '@/lib/api/papers';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const CreateProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    qualifications: '',
    institution: '',
    contact_email: user?.email || '',
    bio: ''
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [papers, setPapers] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handlePapersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPapers(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.qualifications || !formData.institution || !formData.contact_email || !formData.bio) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Build FormData for upload
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });

      if (photo) {
        fd.append("photo", photo);
      }

      papers.forEach((file) => {
        fd.append("papers", file);
      });

      await createResearcherProfile(fd);

      toast({
        title: 'Profile Created!',
        description: 'Your researcher profile is now live.',
      });

      navigate('/researchers');
    } catch (err: any) {
      toast({
        title: 'Failed to Create Profile',
        description: err.message || 'Unable to create researcher profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
        <Card className="max-w-2xl mx-auto border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full gradient-primary flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-heading">Create Your Researcher Profile</CardTitle>
            <CardDescription>
              Share your expertise and become discoverable to potential collaborators
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Dr. John Smith"
                />
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications *</Label>
                <Input
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="PhD in Computer Science"
                />
              </div>

              {/* Institution */}
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="IIT, MIT, Stanford..."
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / Research Interests *</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={loading}
                  rows={5}
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Profile Photo (optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={loading}
                />
              </div>

              {/* Research Papers Upload */}
              <div className="space-y-2">
                <Label>Upload Research Papers (PDF) – Optional</Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handlePapersChange}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} disabled={loading}>
                  Cancel
                </Button>

                <Button type="submit" className="flex-1 gradient-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    'Create Profile'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateProfile;
