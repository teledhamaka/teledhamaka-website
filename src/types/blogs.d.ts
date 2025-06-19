declare module '@/data/blogs' {
  import { Blog } from './blog';
  
  const blogs: Record<string, Blog>;
  export default blogs;
}

declare namespace BlogTypes {
  interface Blog {
    slug: string;
    title: string;
    description: string;
    image: string;
    secondaryImage?: string;
    altText: string;
    secondaryAltText?: string;
    publishedDate: string;
    content: BlogContent[];
    tags: string[];
  }

  type BlogContent = 
    | { type: 'paragraph'; text: string }
    | { type: 'header'; text: string }
    | { type: 'section'; title: string; items?: BlogItem[]; subsections?: BlogSubsection[]; content?: string }
    | { type: 'table'; title: string; headers: string[]; rows: string[][] }
    | { type: 'disclaimer'; text: string };

  interface BlogItem {
    icon?: string;
    text: string;
  }

  interface BlogSubsection {
    title: string;
    icon?: string;
    content?: string;
    items?: string[];
  }
}

export type { BlogTypes };