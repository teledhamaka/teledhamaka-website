import Link from 'next/link';

// Define the category type
interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface BlogCategoryCardProps {
  category: Category;
}

export default function BlogCategoryCard({ category }: BlogCategoryCardProps) {
  return (
    <Link href={`/blog/category/${category.id}`}>
      <div className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
        <div className="text-4xl mb-3">{category.icon}</div>
        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
        <p className="text-gray-600">{category.count} articles</p>
      </div>
    </Link>
  );
}