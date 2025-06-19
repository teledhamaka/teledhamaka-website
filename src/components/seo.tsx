import { NextSeo } from 'next-seo';
import Head from 'next/head';

interface SeoProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedDate?: string;
  tags?: string[];
}

export default function Seo({
  title,
  description,
  url,
  image = '/images/default-og.jpg',
  publishedDate,
  tags = []
}: SeoProps) {
  const fullUrl = `https://yourdomain.com${url}`;
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        {publishedDate && (
          <meta property="article:published_time" content={publishedDate} />
        )}
        {tags.length > 0 && (
          <meta property="article:tag" content={tags.join(', ')} />
        )}
      </Head>
      
      <NextSeo
        title={title}
        description={description}
        canonical={fullUrl}
        openGraph={{
          type: 'article',
          url: fullUrl,
          title,
          description,
          images: [
            {
              url: `https://yourdomain.com${image}`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
          article: {
            publishedTime: publishedDate,
            tags,
          },
          site_name: 'BSNL Broadband Blog',
        }}
        twitter={{
          handle: '@bsnl_official',
          site: '@bsnl_official',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'twitter:image',
            content: `https://yourdomain.com${image}`,
          },
          {
            name: 'keywords',
            content: tags.join(', '),
          },
        ]}
      />
    </>
  );
}