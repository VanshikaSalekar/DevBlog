
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Settings as SettingsIcon, LogOut, User, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Please sign in to view settings.</p>
        </div>
      </div>
    );
  }

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
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="font-mono text-3xl font-bold">Settings</h1>
          </div>
          
          <div className="grid gap-8">
            <Card className="glass-card overflow-hidden">
              <div className="h-12 gradient-bg"></div>
              <CardHeader className="-mt-6">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how Markdown Maven looks on your device
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="theme-mode" className="text-base font-medium">Theme Mode</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Choose between dark and light mode
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Sun className="h-5 w-5 text-muted-foreground" />
                      <Switch 
                        id="theme-mode"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                      />
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card overflow-hidden">
              <div className="h-12 gradient-bg"></div>
              <CardHeader className="-mt-6">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account
                </CardTitle>
                <CardDescription>
                  Manage your account settings
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Email Address</Label>
                    <p className="text-sm text-muted-foreground mt-1 p-2 border rounded-md bg-muted/30">
                      {user.email}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Profile</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        View and edit your profile information
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <Link to="/profile">
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <Label className="text-base font-medium text-destructive flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Danger Zone
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      These actions cannot be undone
                    </p>
                    
                    <Button variant="destructive" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

export default Settings;
