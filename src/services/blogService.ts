
import { BlogPost } from '@/components/BlogCard';

// Sample blog posts data
const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-with-react-and-typescript',
    content_md: `
# Getting Started with React and TypeScript

TypeScript has become increasingly popular in the React ecosystem. In this post, we'll explore how to set up a new React project with TypeScript.

## Setting Up Your Environment

First, make sure you have Node.js installed. Then, you can create a new React TypeScript project using create-react-app:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

This will generate a new React project with TypeScript already configured.

## Type Safety in Components

One of the biggest advantages of using TypeScript with React is the ability to type your component props and state:

\`\`\`typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};
\`\`\`

## Conclusion

TypeScript might seem like an overhead at first, but it greatly improves code quality and developer experience.
    `,
    cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['React', 'TypeScript', 'Frontend'],
    created_at: new Date(2023, 5, 15).toISOString(),
    updated_at: new Date(2023, 5, 15).toISOString(),
    user: {
      id: '101',
      display_name: 'Dev Expert',
      email: 'dev@example.com',
      avatar_url: 'https://ui-avatars.com/api/?name=Dev+Expert&background=random',
    },
  },
  {
    id: '2',
    title: 'Advanced CSS Grid Techniques',
    slug: 'advanced-css-grid-techniques',
    content_md: `
# Advanced CSS Grid Techniques

CSS Grid has revolutionized web layout. In this post, we'll dive into some advanced techniques.

## Grid Template Areas

One of the most powerful features of CSS Grid is grid-template-areas:

\`\`\`css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Layouts Without Media Queries

Using CSS Grid, we can create responsive layouts without media queries:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
\`\`\`

This will automatically adjust the number of columns based on the available space.

## Conclusion

CSS Grid offers incredible flexibility for creating complex layouts.
    `,
    cover_image_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CSS', 'Web Design', 'Frontend'],
    created_at: new Date(2023, 6, 22).toISOString(),
    updated_at: new Date(2023, 6, 23).toISOString(),
    user: {
      id: '102',
      display_name: 'CSS Wizard',
      email: 'css@example.com',
      avatar_url: 'https://ui-avatars.com/api/?name=CSS+Wizard&background=random',
    },
  },
  {
    id: '3',
    title: 'Optimizing React Performance',
    slug: 'optimizing-react-performance',
    content_md: `
# Optimizing React Performance

Performance optimization is crucial for React applications. Let's explore some techniques.

## Memoization with React.memo

To prevent unnecessary renders of functional components:

\`\`\`jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* rendering logic */
});
\`\`\`

## Using useCallback for Event Handlers

\`\`\`jsx
const handleClick = useCallback(() => {
  // handle click event
}, [dependency]);
\`\`\`

## Virtualized Lists

For large lists, consider using virtualization:

\`\`\`jsx
import { FixedSizeList } from 'react-window';

const MyList = ({ items }) => (
  <FixedSizeList
    height={500}
    width={500}
    itemSize={50}
    itemCount={items.length}
  >
    {({ index, style }) => (
      <div style={style}>
        {items[index]}
      </div>
    )}
  </FixedSizeList>
);
\`\`\`

## Conclusion

These techniques can significantly improve the performance of your React applications.
    `,
    cover_image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['React', 'Performance', 'JavaScript'],
    created_at: new Date(2023, 7, 5).toISOString(),
    updated_at: new Date(2023, 7, 6).toISOString(),
    user: {
      id: '103',
      display_name: 'Performance Guru',
      email: 'perf@example.com',
      avatar_url: 'https://ui-avatars.com/api/?name=Performance+Guru&background=random',
    },
  },
];

// Use localStorage to persist created posts across sessions
const getStoredPosts = (): BlogPost[] => {
  const storedPosts = localStorage.getItem('userCreatedPosts');
  return storedPosts ? JSON.parse(storedPosts) : [];
};

// Save posts to localStorage
const savePostsToStorage = (posts: BlogPost[]) => {
  localStorage.setItem('userCreatedPosts', JSON.stringify(posts));
};

// All posts (sample + user created)
let allBlogPosts: BlogPost[] = [...sampleBlogPosts, ...getStoredPosts()];

// Service functions
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  // Include both sample and user-created posts
  return new Promise((resolve) => {
    setTimeout(() => resolve(allBlogPosts), 500);
  });
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = allBlogPosts.find((post) => post.slug === slug);
      resolve(post);
    }, 500);
  });
};

export const createBlogPost = async (blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> => {
  const now = new Date().toISOString();
  const newPost: BlogPost = {
    ...blogPost,
    id: `post-${Date.now()}`,
    created_at: now,
    updated_at: now,
  };
  
  // Add the new post to the collection and persist
  allBlogPosts = [...allBlogPosts, newPost];
  
  // Save user-created posts to localStorage
  const userCreatedPosts = getStoredPosts();
  savePostsToStorage([...userCreatedPosts, newPost]);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(newPost), 500);
  });
};

export const updateBlogPost = async (blogPostUpdate: Partial<BlogPost> & { id: string }): Promise<BlogPost> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postIndex = allBlogPosts.findIndex(post => post.id === blogPostUpdate.id);
      
      if (postIndex === -1) {
        reject(new Error("Post not found"));
        return;
      }
      
      const oldPost = allBlogPosts[postIndex];
      const now = new Date().toISOString();
      
      const updatedPost: BlogPost = {
        ...oldPost,
        ...blogPostUpdate,
        updated_at: now,
      };
      
      // Update the post in the collection
      allBlogPosts = [
        ...allBlogPosts.slice(0, postIndex),
        updatedPost,
        ...allBlogPosts.slice(postIndex + 1)
      ];
      
      // Update in localStorage
      const userCreatedPosts = getStoredPosts();
      const userPostIndex = userCreatedPosts.findIndex(post => post.id === blogPostUpdate.id);
      
      if (userPostIndex !== -1) {
        const updatedUserPosts = [
          ...userCreatedPosts.slice(0, userPostIndex),
          updatedPost,
          ...userCreatedPosts.slice(userPostIndex + 1)
        ];
        savePostsToStorage(updatedUserPosts);
      }
      
      resolve(updatedPost);
    }, 500);
  });
};

export const deletePost = async (postId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postIndex = allBlogPosts.findIndex(post => post.id === postId);
      
      if (postIndex === -1) {
        reject(new Error("Post not found"));
        return;
      }
      
      // Remove the post from the collection
      allBlogPosts = [
        ...allBlogPosts.slice(0, postIndex),
        ...allBlogPosts.slice(postIndex + 1)
      ];
      
      // Remove from localStorage if needed
      const userCreatedPosts = getStoredPosts();
      const userPostIndex = userCreatedPosts.findIndex(post => post.id === postId);
      
      if (userPostIndex !== -1) {
        const updatedUserPosts = [
          ...userCreatedPosts.slice(0, userPostIndex),
          ...userCreatedPosts.slice(userPostIndex + 1)
        ];
        savePostsToStorage(updatedUserPosts);
      }
      
      resolve();
    }, 500);
  });
};
