import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MessageList from "@/components/messaging/MessageList";
import MessageInput from "@/components/messaging/MessageInput";
import { Conversation } from "@shared/schema";
import AuthModal from "@/components/auth/AuthModal";

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Parse conversation or mentor from query parameters if available
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const conversationId = queryParams.get("conversation");
    const mentorId = queryParams.get("mentor");
    
    if (conversationId) {
      setActiveConversationId(parseInt(conversationId));
    } else if (mentorId && isAuthenticated) {
      // Find or create conversation with this mentor
      fetch(`/api/messages/conversation/mentor/${mentorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then(res => res.json())
        .then(data => {
          setActiveConversationId(data.conversationId);
        })
        .catch(error => {
          console.error("Error creating conversation:", error);
          toast({
            title: "Error",
            description: "Could not create or retrieve conversation with this mentor",
            variant: "destructive",
          });
        });
    }
  }, [isAuthenticated]);

  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/messages/conversations"],
    enabled: isAuthenticated,
  });

  const { data: activeConversation } = useQuery<Conversation>({
    queryKey: [`/api/messages/conversation/${activeConversationId}`],
    enabled: !!activeConversationId && isAuthenticated,
  });

  // Filter conversations based on search query
  const filteredConversations = conversations?.filter(convo => {
    const otherParticipant = convo.participants.find(p => p.id !== user?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleConversationSelect = (conversationId: number) => {
    setActiveConversationId(conversationId);
    
    // Update URL without a page reload
    const url = new URL(window.location.href);
    url.searchParams.set("conversation", conversationId.toString());
    window.history.pushState({}, '', url.toString());
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access messages. Please log in or create an account to continue.
          </p>
          <button 
            onClick={() => setShowAuthModal(true)} 
            className="px-4 py-2 bg-primary text-white rounded-md font-medium"
          >
            Log In / Sign Up
          </button>
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Messages | MentorConnect</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Conversations List */}
            <div className="md:col-span-1">
              <Card className="h-[calc(100vh-10rem)] flex flex-col">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : filteredConversations && filteredConversations.length > 0 ? (
                    <div>
                      {filteredConversations.map((conversation) => {
                        const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
                        
                        return (
                          <div 
                            key={conversation.id}
                            className={`p-3 border-b flex cursor-pointer hover:bg-gray-50 transition-colors ${
                              activeConversationId === conversation.id ? 'bg-gray-100 hover:bg-gray-100' : ''
                            }`}
                            onClick={() => handleConversationSelect(conversation.id)}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={otherParticipant?.profilePicture} alt={otherParticipant?.name} />
                              <AvatarFallback>
                                {otherParticipant?.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {otherParticipant?.name}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {new Date(conversation.lastMessageTime).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessageContent}
                              </p>
                            </div>
                            
                            {conversation.unreadCount > 0 && (
                              <Badge className="ml-2 self-center bg-primary text-white">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <p className="text-gray-500 mb-2">No conversations found</p>
                      <p className="text-sm text-gray-400">
                        {searchQuery ? "Try a different search term" : "Start messaging a mentor to begin"}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            {/* Message Thread */}
            <div className="md:col-span-2 lg:col-span-3">
              <Card className="h-[calc(100vh-10rem)] flex flex-col">
                {activeConversationId && activeConversation ? (
                  <>
                    {/* Conversation Header */}
                    <div className="p-4 border-b flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={activeConversation.participants.find(p => p.id !== user?.id)?.profilePicture} 
                          alt={activeConversation.participants.find(p => p.id !== user?.id)?.name} 
                        />
                        <AvatarFallback>
                          {(activeConversation.participants.find(p => p.id !== user?.id)?.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">
                          {activeConversation.participants.find(p => p.id !== user?.id)?.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {activeConversation.participants.find(p => p.id !== user?.id)?.title}
                        </p>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 flex flex-col">
                      <MessageList conversationId={activeConversationId} />
                      <MessageInput conversationId={activeConversationId} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your messages</h3>
                    <p className="text-gray-500 mb-2">Select a conversation or start a new one</p>
                    <p className="text-sm text-gray-400">Communicate with mentors before and after sessions</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
