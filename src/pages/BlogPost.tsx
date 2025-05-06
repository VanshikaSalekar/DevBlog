
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { getBlogPostBySlug } from '@/services/blogService';
import { BlogPost as BlogPostType } from '@/components/BlogCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/contexts/AuthContext';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if the current user can edit this post
  const canEdit = user && (user.role === 'admin' || (post && user.id === post.user.id));

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const fetchedPost = await getBlogPostBySlug(slug);
        
        if (!fetchedPost) {
          navigate('/404');
          return;
        }
        
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug, navigate]);

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

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
            <p className="text-muted-foreground">The post you're looking for doesn't exist or has been removed</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cover image */}
          <div className="relative mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.cover_image_url} 
              alt={post.title}
              className="w-full h-[300px] object-cover"
            />
            
            {canEdit && (
              <div className="absolute top-4 right-4">
                <Button 
                  onClick={() => navigate(`/edit/${post.slug}`)} 
                  variant="secondary" 
                  size="sm"
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit Post
                </Button>
              </div>
            )}
          </div>
          
          {/* Post header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={post.user.avatar_url} />
                <AvatarFallback>
                  {post.user.display_name?.[0] || post.user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="font-medium">{post.user.display_name || post.user.email.split('@')[0]}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {post.updated_at !== post.created_at && 
                    ` (Updated: ${new Date(post.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })})`
                  }
                </div>
              </div>
            </div>
          </div>
          
          {/* Post content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content_md}
            </ReactMarkdown>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Markdown Maven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
