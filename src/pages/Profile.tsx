
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { User, Link as LinkIcon, FileEdit, Camera } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  
  // Update state when user changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        display_name: displayName,
        bio,
        avatar_url: avatarUrl,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
      console.error('Update profile error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-4xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-primary" />
            <h1 className="font-mono text-3xl font-bold">Profile</h1>
          </div>
          
          <Card className="glass-card overflow-hidden">
            <div className="h-20 gradient-bg"></div>
            <CardHeader className="-mt-10 flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={avatarUrl} alt={displayName || user.email} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {(displayName || user.email)?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-primary"
                    type="button"
                    onClick={() => document.getElementById('avatar-url-input')?.focus()}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change avatar</span>
                  </Button>
                )}
              </div>
              <CardTitle className="mt-4 text-xl">
                {user.display_name || user.email.split('@')[0]}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {isEditing ? (
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="avatar-url-input" className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Avatar URL
                      </Label>
                      <Input
                        id="avatar-url-input"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="display-name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Display Name
                      </Label>
                      <Input
                        id="display-name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-2">
                        <FileEdit className="h-4 w-4" />
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="bg-background resize-none"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} className="btn-gradient">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Display Name</h3>
                      <div className="p-3 border rounded-md bg-muted/30">
                        {displayName || user.email.split('@')[0]}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Bio</h3>
                      <div className="p-3 border rounded-md bg-muted/30 min-h-[100px] whitespace-pre-wrap">
                        {bio || 'No bio provided.'}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={() => setIsEditing(true)} className="btn-gradient">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <footer className="border-t bg-secondary/50 dark:bg-secondary/20 py-6">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Markdown Maven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
