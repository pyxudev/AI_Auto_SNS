import { formatTime } from "@/utils/formatTime";
import Image from "next/image";

interface ParentProps {
    user: string;
    avatar: string;
    content: string;
    createdAt: number;
    children?: React.ReactNode;
}

export default function ParentPost({ user, avatar, content, createdAt, children }: ParentProps) {
    return (
        <div className="border-b border-neutral-800 px-4 py-3 flex gap-3 hover:bg-neutral-900 transition-colors">
            <Image src={avatar} className="w-12 h-12 rounded-full" alt="Icon" width={40} height={40}  />
            <div className="flex-1">
                <p className="font-semibold text-[15px]">{user}</p>
                <div className="text-gray-500 text-sm">{formatTime(createdAt)}</div>
                <p className="mt-1 whitespace-pre-line text-[15px]">{content}</p>
                <div className="mt-3 space-y-3">
                    {children}
                </div>
            </div>
        </div>
    );
}
