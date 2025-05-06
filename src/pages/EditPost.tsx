
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getBlogPostBySlug, updateBlogPost } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { TagInput } from '@/components/TagInput';

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [postId, setPostId] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const post = await getBlogPostBySlug(slug);
        
        if (!post) {
          toast({
            title: "Post not found",
            description: "The post you're trying to edit could not be found.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Check if current user is the author or admin
        if (user?.id !== post.user.id && user?.role !== 'admin') {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to edit this post.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        setTitle(post.title);
        setContent(post.content_md);
        setCoverImageUrl(post.cover_image_url);
        setTags(post.tags);
        setPostId(post.id);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Error",
          description: "Failed to load post. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug, navigate, toast, user]);

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
      
      // Generate a new slug if title has changed
      const newSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      const updatedPost = await updateBlogPost({
        id: postId,
        title,
        slug: newSlug,
        content_md: content,
        cover_image_url: coverImageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: tags.length > 0 ? tags : ['Uncategorized'],
      });
      
      toast({
        title: "Post updated!",
        description: "Your post has been successfully updated.",
      });
      
      navigate(`/blog/${updatedPost.slug}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

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
          <h1 className="font-mono text-3xl font-bold mb-6">Edit Post</h1>
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>
                  Update your blog post
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
                <Button variant="outline" type="button" onClick={() => navigate(`/blog/${slug}`)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Update Post'}
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

export default EditPost;
