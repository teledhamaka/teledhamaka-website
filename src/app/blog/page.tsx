// src/app/blog/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import BlogList from '@/components/blog/BlogList';
import Pagination from '@/components/blog/Pagination';
import SearchBar from '@/components/blog/SearchBar';
import { categories } from '@/lib/categories';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  content: string;
}

interface PaginatedPosts {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  currentPage: number;
}

async function getPaginatedPosts(
  allPosts: BlogPost[],
  page: number,
  perPage: number,
  category?: string,
  search?: string
): Promise<PaginatedPosts> {
  // Filter by category if specified
  let filteredPosts = category 
    ? allPosts.filter(post => post.category === category)
    : allPosts;

  // Filter by search query if specified
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }

  // Sort by date (newest first)
  filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const posts = filteredPosts.slice(startIndex, startIndex + perPage);

  return {
    posts,
    total,
    totalPages,
    currentPage: page
  };
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <BlogContent />
    </Suspense>
  );
}

function BlogContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PaginatedPosts | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || undefined;

  // Load blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const posts = await response.json();
          setAllPosts(posts);
        }
      } catch (error) {
        // Silently handle errors without displaying to user
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Filter and paginate posts when parameters change
  useEffect(() => {
    if (allPosts.length > 0) {
      const fetchData = async () => {
        const result = await getPaginatedPosts(allPosts, page, 6, category, search);
        setData(result);
      };
      
      fetchData();
    } else if (!loading) {
      // If no posts are available but loading is complete
      setData({
        posts: [],
        total: 0,
        totalPages: 0,
        currentPage: 1
      });
    }
  }, [allPosts, page, search, category, loading]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  const { posts, total, totalPages, currentPage } = data || {
    posts: [],
    total: 0,
    totalPages: 0,
    currentPage: 1
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">BSNL Insights Hub</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your trusted source for telecom news, plan updates, and tech guides
        </p>
      </section>

      {/* Search Bar */}
      <div className="mb-10">
        <SearchBar initialValue={search} />
        <p className="text-sm text-gray-500 mt-2">
          {total} {total === 1 ? 'post' : 'posts'} found
        </p>  
      </div>

      {/* Blog List */}
      {posts.length > 0 ? (
        <BlogList posts={posts} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          totalPages={totalPages} 
          currentPage={currentPage}
          searchQuery={search}
          category={category}
        />
      )}

      {/* Category Sections */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Explore by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => {
            const count = allPosts.filter(post => post.category === cat.id).length;
            
            return (
              <Link key={cat.id} href={`/blog/category/${cat.id}`}>
                <div className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
                  <p className="text-gray-600">{count} articles</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}