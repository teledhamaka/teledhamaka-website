import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import blogData from '@/data/blogData.json';

export interface BlogPost {
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

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await Promise.all(blogData.posts.map(async (post) => {
      const filePath = path.join(process.cwd(), post.filePath);
      
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return {
          ...post.metadata,
          slug: post.slug,
          content: '',
          author: blogData.authors[post.metadata.author as keyof typeof blogData.authors]
        };
      }

      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { content } = matter(fileContents);
      const author = blogData.authors[post.metadata.author as keyof typeof blogData.authors];
      
      return {
        slug: post.slug,
        title: post.metadata.title,
        excerpt: post.metadata.excerpt,
        date: post.metadata.date,
        coverImage: post.metadata.coverImage,
        category: post.metadata.category,
        author: {
          name: author.name,
          avatar: author.avatar
        },
        tags: post.metadata.tags,
        content
      };
    }));
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}