// lib/blogUtils.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import blogData from '@/data/blogData.json';

// Type Definitions
export type Author = {
  name: string;
  avatar: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
};

export type PostMetadata = {
  slug: string;
  filePath: string;
  metadata: {
    title: string;
    excerpt: string;
    date: string;
    author: string;
    coverImage?: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    featured?: boolean;
    readTime?: number;
    category?: string;
  };
};

export type FullPostData = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage?: string;
  category?: string;
  author: Author;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  contentHtml: string;
  rawContent: string;
  rawMarkdownContent: string;
  featured?: boolean;
  readTime?: number;
};

export interface PaginatedPosts {
  posts: Array<Omit<FullPostData, 'contentHtml' | 'rawContent'> & { rawMarkdownContent: string }>;
  total: number;
  totalPages: number;
  currentPage: number;
}

// Utility Functions
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Core Functions
export function getAllPostSlugs(): { slug: string }[] {
  return blogData.posts.map((post: PostMetadata) => ({
    slug: post.slug,
  }));
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  blogData.posts.forEach((post: PostMetadata) => {
    if (post.metadata.category) {
      categories.add(post.metadata.category);
    }
  });
  return Array.from(categories);
}

export async function getPostDataBySlug(slug: string): Promise<FullPostData | null> {
  const postEntry = blogData.posts.find((post: PostMetadata) => post.slug === slug);

  if (!postEntry) {
    return null;
  }

  const filePath = path.join(process.cwd(), postEntry.filePath);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);

  const authorKey = postEntry.metadata.author as keyof typeof blogData.authors;
  const authorDetails = blogData.authors[authorKey];

  return {
    slug: postEntry.slug,
    title: postEntry.metadata.title,
    excerpt: postEntry.metadata.excerpt,
    date: postEntry.metadata.date,
    coverImage: postEntry.metadata.coverImage,
    category: postEntry.metadata.category,
    author: authorDetails,
    tags: postEntry.metadata.tags,
    metaTitle: postEntry.metadata.metaTitle,
    metaDescription: postEntry.metadata.metaDescription,
    keywords: postEntry.metadata.keywords,
    contentHtml: processedContent.toString(),
    rawContent: content,
    rawMarkdownContent: content,
    //featured: postEntry.metadata.featured,
    //readTime: postEntry.metadata.readTime || calculateReadTime(content),
  };
}

export async function getPaginatedPosts(
  page: number = 1,
  perPage: number = 6,
  category?: string,
  search?: string
): Promise<PaginatedPosts> {
  // Process all posts metadata (without full content)
  const allPosts = await Promise.all(
    blogData.posts.map(async (post: PostMetadata) => {
      const filePath = path.join(process.cwd(), post.filePath);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { content } = matter(fileContents);
      const authorKey = post.metadata.author as keyof typeof blogData.authors;
      const authorDetails = blogData.authors[authorKey];

      return {
        slug: post.slug,
        title: post.metadata.title,
        excerpt: post.metadata.excerpt,
        date: post.metadata.date,
        coverImage: post.metadata.coverImage,
        category: post.metadata.category,
        author: authorDetails,
        tags: post.metadata.tags,
        metaTitle: post.metadata.metaTitle,
        metaDescription: post.metadata.metaDescription,
        keywords: post.metadata.keywords,
        featured: post.metadata.featured,
        readTime: post.metadata.readTime || calculateReadTime(content),
        rawMarkdownContent: content,
      };
    })
  );

  // Apply filters
  let filteredPosts = [...allPosts];
  
  if (category) {
    filteredPosts = filteredPosts.filter(post => post.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      (post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      (post.category?.toLowerCase().includes(searchLower))
      )
    );
  }

  // Sort by date (newest first)
  filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Paginate results
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const posts = filteredPosts.slice(startIndex, startIndex + perPage);

  return {
    posts,
    total,
    totalPages,
    currentPage: page,
  };
}

// View Count Tracking
export async function incrementViewCount(slug: string): Promise<void> {
  try {
    await fetch(`/api/views/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}