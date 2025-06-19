// types/index.ts
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  category: string;
  // Add other properties as needed
  readTime?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  author?: string;
  keywords?: string[];
}