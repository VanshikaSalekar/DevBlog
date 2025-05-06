
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { getBlogPosts } from '@/services/blogService';
import { BlogCard, BlogPost } from '@/components/BlogCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Search, Tag, X } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Explore = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

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
    setCurrentPage(1); // Reset pagination when filter changes
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const filteredPosts = posts.filter((post) => {
    // Filter by search query
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesQuery = searchQuery === '' || 
                       post.title.toLowerCase().includes(lowerCaseQuery) ||
                       post.content_md.toLowerCase().includes(lowerCaseQuery);
    
    // Filter by selected tags
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every((tag) => post.tags.includes(tag));
    
    // Filter by tab
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "recent" && new Date(post.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) || // Last 30 days
      (activeTab === "popular" && post.id.startsWith('post')); // Just a placeholder criterion
    
    return matchesQuery && matchesTags && matchesTab;
  });

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <section className="mb-8">
          <motion.h1 
            className="font-mono text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Explore Posts
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover articles, tutorials, and insights from the community
          </motion.p>
        </section>

        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by title or content..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset pagination when search changes
                }}
                className="pl-9 w-full"
              />
            </div>
            
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>
          
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Popular Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <section>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : currentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => paginate(currentPage - 1)} 
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                      let pageNum;
                      
                      // Logic to show appropriate page numbers
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }
                      
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={pageNum === currentPage}
                              onClick={() => paginate(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => paginate(currentPage + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No posts found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </section>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Markdown Maven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Explore;
