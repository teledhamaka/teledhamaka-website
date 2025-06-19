import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json');

interface Comment {
  id: string;
  [key: string]: unknown;
}

interface CommentsData {
  [slug: string]: Comment[];
}

async function ensureDataDirectory(): Promise<void> {
  const dataDir = path.dirname(COMMENTS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Helper function to resolve params
async function resolveParams(params: Promise<Record<string, string>>) {
  return await params;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  await ensureDataDirectory();
  const { slug } = await resolveParams(context.params);

  try {
    const fileContents = await fs.readFile(COMMENTS_FILE, 'utf8');
    const allComments: CommentsData = JSON.parse(fileContents);
    return NextResponse.json({ comments: allComments[slug] || [] });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  await ensureDataDirectory();
  const { slug } = await resolveParams(context.params);
  
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    let allComments: CommentsData = {};
    try {
      const fileContents = await fs.readFile(COMMENTS_FILE, 'utf8');
      allComments = JSON.parse(fileContents);
    } catch {
      return NextResponse.json(
        { error: 'No comments found' },
        { status: 404 }
      );
    }

    if (!allComments[slug]) {
      return NextResponse.json(
        { error: 'No comments found for this slug' },
        { status: 404 }
      );
    }

    const initialLength = allComments[slug].length;
    allComments[slug] = allComments[slug].filter(comment => comment.id !== id);

    if (allComments[slug].length === initialLength) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    await fs.writeFile(COMMENTS_FILE, JSON.stringify(allComments, null, 2));
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}