import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const LIKES_FILE = path.join(process.cwd(), 'data', 'likes.json');

async function ensureDataDirectory() {
  const dataDir = path.dirname(LIKES_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

interface LikesData {
  [slug: string]: number;
}

// Helper function to resolve params
async function resolveParams(params: Promise<Record<string, string>>) {
  return await params;
}

// GET request
export async function GET(
  request: Request, 
  context: { params: Promise<{ slug: string }> }
) {
  await ensureDataDirectory();
  const { slug } = await resolveParams(context.params);
  
  try {
    const fileContents = await fs.readFile(LIKES_FILE, 'utf8');
    const likes: LikesData = JSON.parse(fileContents);
    return NextResponse.json({ likes: likes[slug] || 0 });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return NextResponse.json({ likes: 0 });
    }
    console.error('Error reading likes file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST request to increment likes
export async function POST(
  request: Request, 
  context: { params: Promise<{ slug: string }> }
) {
  await ensureDataDirectory();
  const { slug } = await resolveParams(context.params);

  let likes: LikesData = {};
  try {
    const fileContents = await fs.readFile(LIKES_FILE, 'utf8');
    likes = JSON.parse(fileContents);
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      console.error('Error reading likes file for POST:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  likes[slug] = (likes[slug] || 0) + 1;

  try {
    await fs.writeFile(LIKES_FILE, JSON.stringify(likes, null, 2), 'utf8');
    return NextResponse.json({ likes: likes[slug] });
  } catch (error) {
    console.error('Error writing likes file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}