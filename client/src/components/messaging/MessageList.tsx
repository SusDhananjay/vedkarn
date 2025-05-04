import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@shared/schema";

interface MessageListProps {
  conversationId: number;
}

export default function MessageList({ conversationId }: MessageListProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: [`/api/messages/${conversationId}`],
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  });

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-500">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === user?.id;
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex items-start max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                <AvatarFallback>
                  {message.senderName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`mx-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                <div 
                  className={`p-3 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-gray-100 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
