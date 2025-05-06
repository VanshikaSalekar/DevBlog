
import React, { useEffect, useState } from 'react';
import { BlogCard, BlogPost } from '@/components/BlogCard';
import { Navbar } from '@/components/Navbar';
import { getBlogPosts } from '@/services/blogService';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Search, X, ChevronRight, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
        
        // Extract all unique tags
        const tags = Array.from(
          new Set(data.flatMap((post) => post.tags))
        );
        setAllTags(tags);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const filteredPosts = posts.filter((post) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesQuery = searchQuery === '' || 
                         post.title.toLowerCase().includes(lowerCaseQuery) ||
                         (post.content_md && post.content_md.toLowerCase().includes(lowerCaseQuery));
    
    const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every((tag) => post.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="hero-section py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-700 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Markdown Maven
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              A developer-centric blogging platform for sharing knowledge with markdown.
            </motion.p>
            
            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button asChild className="btn-gradient">
                  <Link to="/create">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Create New Post
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4"
              />
            </div>
            
            {(searchQuery || selectedTags.length > 0) && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="text-sm shrink-0"
              >
                <X size={14} className="mr-1" />
                Clear filters
              </Button>
            )}

            <Link to="/explore" className="hidden sm:flex items-center text-primary hover:underline">
              <span className="mr-1">Explore all</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-lg p-12 text-center">
              <h3 className="text-xl font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link to="/explore" className="sm:hidden inline-flex items-center text-primary hover:underline">
              <span className="mr-1">Explore all posts</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="border-t bg-secondary/50 dark:bg-secondary/20 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Markdown Maven. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
