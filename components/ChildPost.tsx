import { formatTime } from "@/utils/formatTime";
import Image from "next/image";

interface ChildProps {
    user: string;
    avatar: string;
    content: string;
    createdAt: number;
}

export default function ChildPost({ user, avatar, content, createdAt }: ChildProps) {
    return (
        <div className="flex gap-3 px-1">
            <Image src={avatar} className="w-8 h-8 rounded-full" alt="Icon" width={32} height={32} />
            <div>
                <p className="font-semibold text-sm">{user}</p>
                <div className="text-gray-500 text-xs">{formatTime(createdAt)}</div>
                <p className="text-sm whitespace-pre-line mt-1">{content}</p>
            </div>
        </div>
    );
}
