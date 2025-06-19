// lib/categories.ts
import { BlogPost } from '@/types'; // Make sure this interface exists

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'broadband',
    name: 'Broadband',
    icon: '📶',
    description: 'BSNL fiber broadband plans, speed tests, and connectivity solutions',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: '📱',
    description: 'Prepaid, postpaid plans, mobile offers, and network coverage',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: '🏢',
    description: 'Business solutions, leased lines, and corporate services',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: '🔧',
    description: 'Troubleshooting guides, how-tos, and tech support',
    color: 'bg-yellow-100 text-yellow-800'
  }
];

/**
 * Get category information by ID
 * @param id - Category ID
 * @returns Category object or undefined if not found
 */
export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

/**
 * Get all categories with post counts
 * @param posts - Array of blog posts
 * @returns Array of categories with post counts
 */
export function getCategoriesWithCounts(posts: BlogPost[]): (Category & { count: number })[] {
  return categories.map(category => {
    const count = posts.filter(post => post.category === category.id).length;
    return { ...category, count };
  });
}

/**
 * Get posts for a specific category
 * @param categoryId - Category ID to filter by
 * @param posts - Array of blog posts
 * @returns Filtered array of posts in the specified category
 */
export function getPostsByCategory(categoryId: string, posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.category === categoryId);
}

/**
 * Get the most popular categories
 * @param posts - Array of blog posts
 * @param limit - Number of categories to return (default: 3)
 * @returns Array of popular categories with post counts
 */
export function getPopularCategories(posts: BlogPost[], limit = 3): (Category & { count: number })[] {
  const withCounts = getCategoriesWithCounts(posts);
  return withCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Optional: Get category name by ID
export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name || 'Uncategorized';
}

// Add this if you need count
export interface CategoryWithCount extends Category {
  count: number;
}
