import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import { visit } from 'unist-util-visit';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export async function processContent(filePath: string) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContents);
  
  const mdxSource = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        rehypePlugins: [
          () => (tree) => {
            visit(tree, (node) => {
              if (node?.type === 'element' && node?.tagName === 'pre') {
                const [codeEl] = node.children;
                if (codeEl.tagName === 'code') {
                  node.__rawString__ = codeEl.children?.[0].value;
                }
              }
            });
          },
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              keepBackground: false,
              onVisitLine(node: { children: Array<{ type: string; value?: string }> }) {
                if (node.children.length === 0) {
                  node.children = [{ type: 'text', value: ' ' }];
                }
              },
            },
          ],
        ],
      },
    },
  });

  return {
    content: mdxSource,
    metadata: data,
  };
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName => ({
    slug: fileName.replace(/\.md$/, ''),
    filePath: path.join(postsDirectory, fileName),
  }));
}