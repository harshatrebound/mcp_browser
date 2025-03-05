import { cn } from "@/lib/utils";
import { Bot, LoaderCircleIcon, User } from "lucide-react";

export type MessageRole = "user" | "tool";

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: Date;
  loading?: boolean;
}

export function ChatMessage({
  content,
  role,
  timestamp,
  loading = false,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "py-3 px-4 rounded-lg mb-3 max-w-[95%]",
        role === "user"
          ? "bg-primary text-primary-foreground ml-auto rounded-tr-none"
          : "bg-muted text-foreground mr-auto rounded-tl-none",
      )}
    >
      <div className="flex items-center mb-1 gap-1.5">
        {role === "user" ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
        <span className="flex">
          <span className="font-medium">
            {role === "user" ? "You" : "Tool"}
          </span>
          {loading && (
            <LoaderCircleIcon
              className="text-blue-600 animate-spin ml-2"
              size={20}
            />
          )}
        </span>
        {timestamp && (
          <span className="text-xs opacity-70 ml-auto">
            {timestamp.toLocaleTimeString()}
          </span>
        )}
      </div>
      <div className="whitespace-pre-wrap truncate">{content}</div>
    </div>
  );
}
