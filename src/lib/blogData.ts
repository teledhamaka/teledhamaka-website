// Sample data structure
export interface BlogPost {
  [key: string]: string | string[] | undefined; // Generic index signature for additional properties
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  date: string;
  author: string;
  coverImage: string;
  tags: string[];
  keywords: string[];
  category: 'broadband' | 'mobile' | 'enterprise' | 'technical';
  excerpt: string;
  content: string;
}

// Mock blog data
const blogPosts: BlogPost[] = [
  {
    slug: "bsnl-postpaid-plan-525-review",
    title: "BSNL Postpaid Plan-525 - Unlimited Calls, 85GB Data & Great Value",
    metaTitle: "BSNL Plan-525 Review 2025 | 85GB Data + Unlimited Calls",
    metaDescription: "Complete guide to BSNL Postpaid Plan-525 with unlimited calls, 85GB data, free SMS & roaming benefits",
    date: "2025-05-30",
    author: "Telecom Expert",
    coverImage: "./assets/hero-mobile.webp.webp",
    tags: ["BSNL Postpaid Plan 525", "Mobile plans", "Telecom offers"],
    keywords: ["BSNL Postpaid Plan-525", "85GB data plan", "BSNL unlimited calls"],
    category: "mobile",
    excerpt: "Discover why BSNL's Plan-525 is perfect for heavy data users with its 85GB monthly data and unlimited calling benefits.",
    content: `...full markdown content...`
  },
  {
    slug: "how-to-boost-internet-speed",
    title: "How to Boost Internet Speed: 10 Proven Tips for Faster Browsing in 2025",
    metaTitle: "Boost Internet Speed in 2025 | 10 Expert Tips for Faster Connectivity",
    metaDescription: "Struggling with slow internet? Discover 10 proven methods to boost your Wi-Fi speed, reduce lag, and optimize your connection for streaming, gaming, and work.",
    date: "2025-06-04",
    author: "Tech Expert",
    coverImage: "/assets/hero-broadband.webp",
    tags: ["boost internet speed", "Wi-Fi optimization", "faster browsing", "reduce latency", "internet troubleshooting"],
    keywords: ["how to increase Wi-Fi speed", "best DNS servers 2025", "fix slow internet", "optimize router settings"],
    category: "technical",
    excerpt: "Tired of buffering? Learn 10 expert-approved ways to boost your internet speed for seamless streaming, gaming, and browsing.",
    content: `...full markdown content...`
  },
  
  // Add more blog posts here...
];

// Data access functions
export function getAllBlogs(): BlogPost[] {
  return blogPosts;
}

export function getBlogBySlug(slug: string): BlogPost {
  return blogPosts.find(post => post.slug === slug) || blogPosts[0];
}

export function getRelatedBlogs(currentSlug: string, limit = 2): BlogPost[] {
  const current = getBlogBySlug(currentSlug);
  return blogPosts
    .filter(post => post.slug !== currentSlug && post.category === current.category)
    .slice(0, limit);
}