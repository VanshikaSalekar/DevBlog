
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createBlogPost } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { TagInput } from '@/components/TagInput';

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Please provide a title and content for your post",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Generate a slug from the title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      const newPost = {
        title,
        slug,
        content_md: content,
        cover_image_url: coverImageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: tags.length > 0 ? tags : ['Uncategorized'],
        user: user!
      };
      
      const post = await createBlogPost(newPost);
      
      toast({
        title: "Post created!",
        description: "Your post has been successfully published.",
      });
      
      navigate(`/blog/${post.slug}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="font-mono text-3xl font-bold mb-6">Create New Post</h1>
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>
                  Create your new markdown blog post
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter a title for your post" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cover-image">Cover Image URL</Label>
                  <Input 
                    id="cover-image" 
                    placeholder="Enter a URL for the cover image" 
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <TagInput 
                    id="tags" 
                    tags={tags} 
                    setTags={setTags}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown)</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Write your post content using markdown..." 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] font-mono"
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </motion.div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Markdown Maven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CreatePost;
