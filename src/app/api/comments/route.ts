// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json');

async function ensureDataDirectory() {
  const dataDir = path.dirname(COMMENTS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

interface Comment {
  id: string;
  name: string;
  email: string | null;
  comment: string;
  date: string;
}

interface CommentsData {
  [slug: string]: Comment[];
}

export async function POST(request: Request) {
  await ensureDataDirectory();
  try {
    const { slug, name, email, comment } = await request.json();

    if (!slug || !name || !comment) {
      return NextResponse.json({ error: 'Slug, name, and comment are required' }, { status: 400 });
    }

    let allComments: CommentsData = {};
    try {
      const fileContents = await fs.readFile(COMMENTS_FILE, 'utf8');
      allComments = JSON.parse(fileContents);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        console.error('Error reading comments file for POST:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    }

    const newComment: Comment = {
      id: uuidv4(),
      name,
      email: email || null, // Email is optional
      comment,
      date: new Date().toISOString(),
    };

    if (!allComments[slug]) {
      allComments[slug] = [];
    }
    allComments[slug].push(newComment);

    await fs.writeFile(COMMENTS_FILE, JSON.stringify(allComments, null, 2), 'utf8');

    return NextResponse.json({ message: 'Comment added successfully', comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}