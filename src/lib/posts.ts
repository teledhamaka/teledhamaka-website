import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import blogData from '@/data/blogData.json';

export interface PostMetadata {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  date: string;
  author: string;
  coverImage: string;
  tags?: string[];
  keywords?: string[];
  category: string;
  excerpt: string;
}

export interface Post {
  slug: string;
  metadata: PostMetadata;
  content: string;
}

export interface Author {
  name: string;
  bio: string;
  avatar: string;
}

export function getAllPosts(): Post[] {
  return blogData.posts.map(post => {
    const filePath = path.join(process.cwd(), post.filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContents);
    
    return {
      slug: post.slug,
      metadata: post.metadata,
      content
    };
  });
}

export function getPostBySlug(slug: string): Post | undefined {
  const post = blogData.posts.find(p => p.slug === slug);
  if (!post) return undefined;

  const filePath = path.join(process.cwd(), post.filePath);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);

  return {
    slug,
    metadata: post.metadata,
    content
  };
}

export function getAuthorById(id: string): Author | undefined {
  const authors = blogData.authors as Record<string, Author>;
  return authors[id];
}