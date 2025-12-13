export interface Post {
    id: string;
    user: string;
    avatar: string;
    content: string;
    parentId: string | null;
    createdAt: number;
    children?: Post[]; // GETで親子構造にする時のみ存在
}