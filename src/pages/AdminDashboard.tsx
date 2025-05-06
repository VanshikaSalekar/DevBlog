
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPosts, deletePost } from '@/services/blogService';
import { BlogPost } from '@/components/BlogCard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await getBlogPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Check if user is admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [user, isLoading, navigate]);
  
  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(postId);
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };
  
  const handleEditPost = (slug: string) => {
    navigate(`/edit/${slug}`);
  };
  
  const filteredPosts = searchQuery
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content_md.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

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
        <div className="max-w-6xl mx-auto">
          <h1 className="font-mono text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Tabs defaultValue="posts">
            <TabsList className="mb-6">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Posts</CardTitle>
                  <CardDescription>
                    View, edit, and delete blog posts from here
                  </CardDescription>
                  <div className="mt-4">
                    <Input 
                      placeholder="Search posts..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPosts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No posts found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredPosts.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium max-w-xs truncate">
                                <a 
                                  href={`/blog/${post.slug}`}
                                  className="hover:underline text-foreground"
                                >
                                  {post.title}
                                </a>
                              </TableCell>
                              <TableCell>{post.user.display_name || post.user.email}</TableCell>
                              <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {post.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                  ))}
                                  {post.tags.length > 3 && (
                                    <Badge variant="outline">+{post.tags.length - 3}</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleEditPost(post.slug)}
                                  >
                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleDeletePost(post.id)}
                                  >
                                    <Trash className="h-4 w-4 mr-1" /> Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Users</CardTitle>
                  <CardDescription>
                    User management functionality will be implemented in future updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-md bg-muted/30 text-center">
                    <p>User management functionality is coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>
                    Overview of blog statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border rounded-lg p-4 text-center">
                      <h3 className="text-lg font-medium">Total Posts</h3>
                      <p className="text-3xl font-bold mt-2">{posts.length}</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4 text-center">
                      <h3 className="text-lg font-medium">Total Authors</h3>
                      <p className="text-3xl font-bold mt-2">
                        {new Set(posts.map(post => post.user.id)).size}
                      </p>
                    </div>
                    <div className="bg-card border rounded-lg p-4 text-center">
                      <h3 className="text-lg font-medium">Total Tags</h3>
                      <p className="text-3xl font-bold mt-2">
                        {new Set(posts.flatMap(post => post.tags)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Markdown Maven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
