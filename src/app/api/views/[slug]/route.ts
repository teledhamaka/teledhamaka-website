import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const VIEWS_FILE = path.join(process.cwd(), 'data', 'views.json');

interface ViewsData {
  [slug: string]: number;
}

async function ensureDataDirectory(): Promise<void> {
  const dataDir = path.dirname(VIEWS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// GET request to fetch views for a specific slug
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> } // Updated type
) {
  await ensureDataDirectory();
  const { slug } = await context.params; // Await the promise

  try {
    const fileContents = await fs.readFile(VIEWS_FILE, 'utf8');
    const views: ViewsData = JSON.parse(fileContents);
    return NextResponse.json({ views: views[slug] || 0 });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return NextResponse.json({ views: 0 });
    }
    console.error('Error reading views file:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST request to increment views for a specific slug
export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> } // Updated type
) {
  await ensureDataDirectory();
  const { slug } = await context.params; // Await the promise

  let views: ViewsData = {};
  try {
    const fileContents = await fs.readFile(VIEWS_FILE, 'utf8');
    views = JSON.parse(fileContents);
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      console.error('Error reading views file for POST:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }

  // Increment view count for the slug
  views[slug] = (views[slug] || 0) + 1;

  try {
    await fs.writeFile(VIEWS_FILE, JSON.stringify(views, null, 2), 'utf8');
    return NextResponse.json({ views: views[slug] });
  } catch (error) {
    console.error('Error writing views file:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}