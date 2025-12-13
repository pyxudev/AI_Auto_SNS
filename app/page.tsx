"use client";
import { useEffect, useState } from "react";
import ParentPost from "@/components/ParentPost";
import ChildPost from "@/components/ChildPost";
import { Post } from "@/types/post";

async function fetchPosts(): Promise<Post[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store",
  });
  return res.json();
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const data = await fetchPosts();
        if (alive) setPosts(data);
      } catch (e) {
        console.error(e);
      }
    };

    load(); // 初回実行

    const timer = setInterval(load, 3 * 60 * 1000); // 3分

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <main className="max-w-xl mx-auto border-x border-neutral-800 min-h-screen">
      {posts.map((parent) => (
        <ParentPost
          key={parent.id}
          user={parent.user}
          avatar={parent.avatar}
          content={parent.content}
          createdAt={parent.createdAt}
        >
          {(parent.children ?? []).map((child) => (
            <ChildPost
              key={child.id}
              user={child.user}
              avatar={child.avatar}
              content={child.content}
              createdAt={child.createdAt}
            />
          ))}
        </ParentPost>
      ))}
    </main>
  );
}
