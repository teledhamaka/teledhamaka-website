import Link from 'next/link';

// Define the BlogPost type
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  category: string;
}

interface BlogFeaturedCardProps {
  post: BlogPost;
}

export default function BlogFeaturedCard({ post }: BlogFeaturedCardProps) {
  return (
    <article className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
      <div className="p-4">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          {post.category}
        </span>
        <h3 className="text-xl font-semibold my-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600">{post.excerpt}</p>
        <div className="mt-3 text-sm text-gray-500">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </article>
  );
}