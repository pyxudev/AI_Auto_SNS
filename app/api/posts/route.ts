import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Post } from "@/types/post";

type PostWithChildren = Post & { children: Post[] };
const filePath = path.join(process.cwd(), "data", "posts.json");

function loadPosts(): Post[] {
    try {
        if (!fs.existsSync(filePath)) return []; // ファイルがなければ空配列

        const text = fs.readFileSync(filePath, "utf-8");
        if (!text.trim()) return [];

        return JSON.parse(text) as Post[];
    } catch (err) {
        console.error("loadPosts error:", err);
        return [];
    }
}

function savePosts(posts: Post[]) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // /data の作成
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
}

/** GET: 投稿取得 */
export async function GET() {
    const flat = loadPosts();
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

/** POST: 投稿追加 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const posts = loadPosts();

        const newPost: Post = {
            id: crypto.randomUUID(),
            user: body.user,
            avatar: "/avatar.png",
            content: body.content,
            parentId: body.parentId ?? null,
            createdAt: Date.now(),
        };

        posts.push(newPost);
        savePosts(posts);

        return NextResponse.json({ status: 200, postId: newPost["id"] });
    } catch (e) {
        return NextResponse.json({ status: 400, message: e });
    }
}
