// D:\nextjs\teledhamaka\src\app\blog\category\[category]\page.tsx
import BlogList from '@/components/blog/BlogList';
import Pagination from '@/components/blog/Pagination';
import SearchBar from '@/components/blog/SearchBar';
import { getPaginatedPosts } from '@/lib/blogUtils';
import { categories } from '@/lib/categories';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) { // Changed this line
  // Await params to satisfy the Next.js warning
  const resolvedParams = await params; // No need for Promise.resolve, just await directly
  const categoryId = resolvedParams.category;
  const category = categories.find(c => c.id === categoryId);

  return {
    title: `${category?.name} Articles | BSNL Blog`,
    description: `Explore the latest ${category?.name} news and updates from BSNL`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ category: string | string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categoryId = Array.isArray(resolvedParams.category) ? resolvedParams.category[0] : resolvedParams.category;

  const pageParam = Array.isArray(resolvedSearchParams.page) ? resolvedSearchParams.page[0] : resolvedSearchParams.searchParams;
  const searchParam = Array.isArray(resolvedSearchParams.search) ? resolvedSearchParams.search[0] : resolvedSearchParams.search;

  const page = typeof pageParam === 'string' ? parseInt(pageParam) || 1 : 1;
  const search = typeof searchParam === 'string' ? searchParam : '';

  const category = categories.find(c => c.id === categoryId);
  if (!category) return notFound();

  const { posts, totalPages, currentPage } = await getPaginatedPosts(
    page,
    6,
    categoryId,
    search
  );

  const blogPosts = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    coverImage: post.coverImage || './assets/telecom-expert.jpg',
    category: post.category || 'uncategorized',
    author: post.author,
    tags: post.tags,
    content: post.rawMarkdownContent,
    featured: post.featured || false,
    readTime: post.readTime || 5
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">{category.name} Articles</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Latest updates, news and guides about {category.name} from BSNL
        </p>
      </div>

      <SearchBar initialValue={search} />

      <BlogList posts={blogPosts} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        category={`/blog/category/${categoryId}`}
        searchQuery={search}
      />
    </div>
  );
}