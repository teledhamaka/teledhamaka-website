export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage?: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  tags?: string[];
  content?: string;
  featured?: boolean;
  readTime?: number;
}