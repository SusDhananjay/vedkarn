import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { Calendar, MessageSquare, Video, Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserBooking, Conversation } from "@shared/schema";
import UserCalendar from "@/components/dashboard/UserCalendar";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("calendar");

  const { data: bookings, isLoading: isBookingsLoading } = useQuery<UserBooking[]>({
    queryKey: ["/api/bookings/user"],
    enabled: isAuthenticated,
  });

  const { data: conversations, isLoading: isConversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/messages/conversations"],
    enabled: isAuthenticated,
  });

  // Filter bookings based on active tab
  const upcomingBookings = bookings?.filter(booking => new Date(booking.startTime) > new Date()) || [];
  const pastBookings = bookings?.filter(booking => new Date(booking.startTime) <= new Date()) || [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your dashboard. Please log in or create an account to continue.
          </p>
          <Button onClick={() => window.location.href = "/"}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | MentorConnect</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.name || user?.username}! Manage your sessions and messages.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - User Profile */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={user?.profilePicture} alt={user?.name || user?.username} />
                      <AvatarFallback className="text-xl">
                        {(user?.name || user?.username)?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="font-bold text-gray-900 text-lg text-center">
                      {user?.name || user?.username}
                    </h3>
                    <p className="text-gray-600 text-sm text-center">
                      {user?.email}
                    </p>

                    <Separator className="my-4" />

                    <div className="w-full space-y-3">
                      <Link href="/profile/edit">
                        <Button variant="outline" className="w-full">
                          Edit Profile
                        </Button>
                      </Link>
                      {user?.userType === "mentor" && (
                        <Link href="/mentor/dashboard">
                          <Button variant="outline" className="w-full">
                            Switch to Mentor View
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Sessions</span>
                      <span className="font-bold text-gray-900">{bookings?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Upcoming Sessions</span>
                      <span className="font-bold text-gray-900">{upcomingBookings.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Active Conversations</span>
                      <span className="font-bold text-gray-900">{conversations?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="calendar" className="flex-1">
                    <Calendar className="mr-2 h-4 w-4" /> Calendar
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="flex-1">
                    <Clock className="mr-2 h-4 w-4" /> Upcoming ({upcomingBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex-1">
                    <Clock className="mr-2 h-4 w-4" /> Past Sessions ({pastBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" /> Messages ({conversations?.length || 0})
                  </TabsTrigger>
                </TabsList>

                {/* Calendar Tab */}
                <TabsContent value="calendar">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Session Calendar</h2>
                  <UserCalendar />
                </TabsContent>

                {/* Upcoming Sessions Tab */}
                <TabsContent value="upcoming">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
                  
                  {isBookingsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-6 flex-1">
                              <div className="flex items-start mb-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={booking.mentor.profilePicture} alt={booking.mentor.name} />
                                  <AvatarFallback>{booking.mentor.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                  <h3 className="font-bold text-gray-900">{booking.mentor.name}</h3>
                                  <p className="text-sm text-gray-600">{booking.mentor.title} at {booking.mentor.company}</p>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <div className="flex items-center text-gray-700 mb-2">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>{new Date(booking.startTime).toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric'
                                  })}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>
                                    {new Date(booking.startTime).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })} - {new Date(booking.endTime).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-3">
                                {new Date(booking.startTime).getTime() - new Date().getTime() <= 10 * 60 * 1000 ? (
                                  <Link href={`/video-session/${booking.id}`}>
                                    <Button className="w-full">
                                      <Video className="mr-2 h-4 w-4" /> Join Session
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button disabled className="w-full">
                                    <Clock className="mr-2 h-4 w-4" /> Session Not Started
                                  </Button>
                                )}
                                <Link href={`/messages?mentor=${booking.mentor.id}`}>
                                  <Button variant="outline" className="w-full">
                                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                                  </Button>
                                </Link>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-6 md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                                <Badge variant="outline" className="mb-2">45-60 minutes</Badge>
                                <p className="text-sm text-gray-600 mb-4">
                                  One-on-one video mentorship session
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Booking ID: <span className="font-medium">{booking.id}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                  Price: <span className="font-medium">₹1,500</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-gray-600 mb-4">You don't have any upcoming sessions.</p>
                      <Link href="/find-mentors">
                        <Button>
                          Find a Mentor
                        </Button>
                      </Link>
                    </Card>
                  )}
                </TabsContent>

                {/* Past Sessions Tab */}
                <TabsContent value="past">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Past Sessions</h2>
                  
                  {isBookingsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : pastBookings.length > 0 ? (
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-6 flex-1">
                              <div className="flex items-start mb-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={booking.mentor.profilePicture} alt={booking.mentor.name} />
                                  <AvatarFallback>{booking.mentor.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                  <h3 className="font-bold text-gray-900">{booking.mentor.name}</h3>
                                  <p className="text-sm text-gray-600">{booking.mentor.title} at {booking.mentor.company}</p>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <div className="flex items-center text-gray-700 mb-2">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>{new Date(booking.startTime).toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric'
                                  })}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>
                                    {new Date(booking.startTime).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })} - {new Date(booking.endTime).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-3">
                                {booking.reviewId ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mr-auto">
                                    <CheckCircle className="mr-1 h-3 w-3" /> Review Submitted
                                  </Badge>
                                ) : (
                                  <Link href={`/review/${booking.id}`}>
                                    <Button className="w-full">
                                      <Star className="mr-2 h-4 w-4" /> Leave Review
                                    </Button>
                                  </Link>
                                )}
                                <Link href={`/messages?mentor=${booking.mentor.id}`}>
                                  <Button variant="outline" className="w-full">
                                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                                  </Button>
                                </Link>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-6 md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Session Status</h4>
                                {booking.status === "completed" ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                    <CheckCircle className="mr-1 h-3 w-3" /> Completed
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">
                                    <XCircle className="mr-1 h-3 w-3" /> {booking.status}
                                  </Badge>
                                )}
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Booking ID: <span className="font-medium">{booking.id}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                  Price: <span className="font-medium">₹1,500</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-gray-600">You don't have any past sessions.</p>
                    </Card>
                  )}
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
                  
                  {isConversationsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : conversations && conversations.length > 0 ? (
                    <div className="space-y-2">
                      {conversations.map((conversation) => (
                        <Link key={conversation.id} href={`/messages?conversation=${conversation.id}`}>
                          <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarImage 
                                  src={
                                    conversation.participants.find(p => p.id !== user?.id)?.profilePicture
                                  } 
                                  alt={
                                    conversation.participants.find(p => p.id !== user?.id)?.name || "User"
                                  } 
                                />
                                <AvatarFallback>
                                  {(conversation.participants.find(p => p.id !== user?.id)?.name || "U").charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <h3 className="font-medium text-gray-900">
                                    {conversation.participants.find(p => p.id !== user?.id)?.name}
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
                                <Badge className="ml-2 bg-primary text-white">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-gray-600 mb-4">You don't have any active conversations.</p>
                      <Link href="/find-mentors">
                        <Button>
                          Find a Mentor to Message
                        </Button>
                      </Link>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
