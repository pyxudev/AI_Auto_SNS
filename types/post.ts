export interface Post {
    id: string;
    user: string;
    avatar: string;
    content: string;
    parentId: string | null,
    createdAt: number,
    children?: Post[]; // Optional field for nested posts
}