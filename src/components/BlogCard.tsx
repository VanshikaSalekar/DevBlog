
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content_md: string;
  cover_image_url?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    display_name?: string;
    email: string;
    avatar_url?: string;
  };
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  // Calculate reading time (very rough estimate: 200 words per minute)
  const readingTime = Math.max(1, Math.ceil(post.content_md.split(/\s+/).length / 200));

  // Generate excerpt
  const excerpt = post.content_md
    .replace(/[#*_~`]/g, '') // Remove markdown symbols
    .slice(0, 150) + (post.content_md.length > 150 ? '...' : '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="overflow-hidden card-hover">
        <Link to={`/blog/${post.slug}`}>
          {post.cover_image_url && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          
          <CardHeader>
            <div className="space-y-1">
              <h2 className="font-mono text-xl font-semibold tracking-tight">{post.title}</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
          </CardContent>
        </Link>
        
        <CardFooter className="flex justify-between border-t bg-card/50 p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.user.avatar_url || ''} alt={post.user.display_name || post.user.email} />
              <AvatarFallback>
                {(post.user.display_name || post.user.email)[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {post.user.display_name || post.user.email.split('@')[0]}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })} 
            • {readingTime} min read
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
