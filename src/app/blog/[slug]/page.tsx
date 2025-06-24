// app/blog/[slug]/page.tsx
import { getAllPostSlugs, getPostDataBySlug, FullPostData } from '@/lib/blogUtils';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import EngagementMetrics from '@/components/blog/EngagementMetrics';
import ShareButtons from '@/components/blog/ShareButtons';
import CommentForm from '@/components/blog/CommentForm';
import CommentList from '@/components/blog/CommentList';

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const postData = await getPostDataBySlug(slug);
  if (!postData) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }
  return {
    title: postData.title,
    description: postData.excerpt,
    openGraph: {
      title: postData.title,
      description: postData.excerpt,
      type: 'article',
      publishedTime: postData.date,
      url: `https://yourdomain.com/blog/${postData.slug}`,
      images: [
        {
          url: postData.coverImage || 'https://yourdomain.com/images/default-blog-cover.jpg',
          alt: postData.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: postData.excerpt,
      images: [postData.coverImage || 'https://yourdomain.com/images/default-blog-cover.jpg'],
    },
  };
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params; // Await the promise
  const postData: FullPostData | null = await getPostDataBySlug(slug);

  if (!postData) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold mt-20">404 - Blog Post Not Found</h1>
        <p className="mt-4">The blog post you are looking for does not exist.</p>
        <p className="mt-6">
          <Link href="/blog" className="text-blue-600 hover:underline text-lg">
            &larr; Go back to all blogs
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <article className="bg-white rounded-xl shadow-lg p-8 sm:p-10 lg:p-12 mb-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {postData.title}
          </h1>
          <p className="text-md sm:text-lg text-gray-600 mb-2">
            By <span className="font-semibold">{postData.author.name}</span> on{' '}
            {new Date(postData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {postData.category && (
            <Link
              href={`/blog?category=${postData.category}`}
              className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200 mt-2"
            >
              {postData.category.charAt(0).toUpperCase() + postData.category.slice(1)}
            </Link>
          )}

          <EngagementMetrics slug={postData.slug} />

          <div className="mt-6 flex justify-center">
            <ShareButtons title={postData.title} slug={postData.slug} />
          </div>
        </header>

        {postData.coverImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100 mb-10 rounded-lg overflow-hidden shadow-md">
            <Image
              src={postData.coverImage}
              alt={postData.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              priority
              className="rounded-lg"
            />
          </div>
        )}

        <div className="prose prose-lg sm:prose-xl max-w-none mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => <h1 className="text-4xl font-extrabold mt-10 mb-4" {...props} />,
              h2: (props) => <h2 className="text-3xl font-bold mt-8 mb-3" {...props} />,
              h3: (props) => <h3 className="text-2xl font-semibold mt-6 mb-2" {...props} />,
              h4: (props) => <h4 className="text-xl font-semibold mt-5 mb-2" {...props} />,
              h5: (props) => <h5 className="text-lg font-semibold mt-4 mb-1" {...props} />,
              h6: (props) => <h6 className="text-base font-semibold mt-3 mb-1" {...props} />,
              
              p: (props) => <div className="text-gray-800 leading-relaxed my-4" {...props} />,
              
              ul: (props) => <ul className="list-disc list-inside ml-4 my-4" {...props} />,
              ol: (props) => <ol className="list-decimal list-inside ml-4 my-4" {...props} />,
              li: (props) => <li className="mb-1" {...props} />,
              a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
              img: ({ src, alt = ''}) => {
                const imageSrc = typeof src === 'string' ? src : '';
               return (
                <div className="my-6">
                  {imageSrc && (
                  <div className="relative w-full h-64 sm:h-80 md:h-96">
                   <Image
                     src={imageSrc}
                     alt={alt}
                     fill
                     style={{ objectFit: 'cover' }}
                    className="rounded-lg shadow-md"
                  />
              </div>
           )}
         </div>
       );
      },
              table: (props) => <table className="w-full text-left border-collapse my-6" {...props} />,
              th: (props) => <th className="p-3 border border-gray-300 bg-gray-100 font-semibold" {...props} />,
              td: (props) => <td className="p-3 border border-gray-300" {...props} />,
            }}
          >
            {postData.rawMarkdownContent}
          </ReactMarkdown>
        </div>

        {postData.tags && postData.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {postData.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?search=${encodeURIComponent(tag)}`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-4 py-1 rounded-full transition-colors duration-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {postData.author && (
          <section className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-center">
            <div className="flex flex-col sm:flex-row items-center bg-gray-50 p-6 rounded-lg shadow-inner w-full max-w-md">
              {postData.author.avatar && (
                <Image
                  src={postData.author.avatar}
                  alt={postData.author.name}
                  width={80}
                  height={80}
                  className="rounded-full mr-4 mb-4 sm:mb-0 border-2 border-blue-500"
                />
              )}
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">About {postData.author.name}</h3>
                <p className="text-gray-700">
                  A seasoned expert providing in-depth telecom insights and reviews.
                </p>
              </div>
            </div>
          </section>
        )}
      </article>

      <section className="mt-12 bg-white rounded-xl shadow-lg p-8 sm:p-10 lg:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Comments</h2>
        <CommentForm slug={postData.slug} />
        <CommentList slug={postData.slug} />
      </section>

      <div className="text-center mt-10 mb-8">
        <Link href="/blog" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          &larr; Back to all blogs
        </Link>
      </div>
    </div>
  );
}