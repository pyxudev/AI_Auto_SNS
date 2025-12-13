import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { Post } from "@/types/post";

type PostWithChildren = Post & { children: Post[] };
const FILE_NAME = "posts.json";

async function loadPosts(): Promise<Post[]> {
  const blobs = await list();
  const file = blobs.blobs.find(b => b.pathname === FILE_NAME);
  if (!file) return [];

  const res = await fetch(file.url);
  const text = await res.text();
  if (!text.trim()) return [];

  try {
    return JSON.parse(text) as Post[];
  } catch (e) {
    console.error("JSON parse error:", e);
    return [];
  }
}

async function savePosts(posts: Post[]): Promise<void> {
  await put(FILE_NAME, JSON.stringify(posts, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}

/** GET: Get Posts */
export async function GET() {
  const flat = await loadPosts();

  flat.sort((a, b) => b.createdAt - a.createdAt);

  const parents: PostWithChildren[] = [];
  const childrenMap: Record<string, Post[]> = {};

  flat.forEach(p => {
    if (!p.parentId) {
      parents.push({ ...p, children: [] });
    } else {
      if (!childrenMap[p.parentId]) childrenMap[p.parentId] = [];
      childrenMap[p.parentId].push(p);
    }
  });

  parents.forEach(parent => {
    parent.children = childrenMap[parent.id] ?? [];
  });

  return NextResponse.json(parents);
}

/** POST: Add Posts */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const posts = await loadPosts();

    if (!body.user || !body.content) {
      return NextResponse.json(
        { success: false, message: "Values: user content are required!" },
        { status: 400 }
      );
    }

    const newPost: Post = {
      id: crypto.randomUUID(),
      user: body.user,
      avatar: "/avatar.png",
      content: body.content,
      parentId: body.parentId ?? null,
      createdAt: Date.now(),
    };

    posts.push(newPost);
    await savePosts(posts);

    return NextResponse.json({ success: true, post: newPost });
  } catch (e) {
    console.error("POST error:", e);
    return NextResponse.json(
      { success: false, message: "Failed to post" },
      { status: 500 }
    );
  }
}

/** DELETE: Delete All Posts */
export async function DELETE() {
  try {
    await savePosts([]);

    return NextResponse.json({
      success: true,
      message: "All posts have been deleted",
    });
  } catch (e) {
    console.error("DELETE error:", e);
    return NextResponse.json(
      { success: false, message: "Failed to delete posts!" },
      { status: 500 }
    );
  }
}
