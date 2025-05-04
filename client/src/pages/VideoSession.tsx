import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import VideoCall from "@/components/video/VideoCall";
import { UserBooking } from "@shared/schema";

export default function VideoSession() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [sessionId, setSessionId] = useState("");
  
  const bookingId = parseInt(id);

  const { data: booking, isLoading, error } = useQuery<UserBooking>({
    queryKey: [`/api/bookings/${bookingId}`],
    enabled: isAuthenticated && !!bookingId && !isNaN(bookingId),
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading session details",
        description: "Could not load the session details. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (booking) {
      // Check if the session time is valid (within 10 minutes before or during the session)
      const sessionStartTime = new Date(booking.startTime).getTime();
      const sessionEndTime = new Date(booking.endTime).getTime();
      const now = new Date().getTime();
      
      if (now < sessionStartTime - 10 * 60 * 1000) {
        // Too early for the session
        toast({
          title: "Session not started yet",
          description: "This session is not scheduled to start yet. Please join at the scheduled time.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } else if (now > sessionEndTime) {
        // Session already ended
        toast({
          title: "Session already ended",
          description: "This session has already ended.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } else {
        // Generate a unique session ID based on the booking ID
        setSessionId(`session-${bookingId}`);
      }
    }
  }, [booking]);

  const handleStartSession = () => {
    setSessionStarted(true);
  };

  const handleEndCall = () => {
    setIsCallEnded(true);
    
    // Mark the session as completed on the server
    fetch(`/api/bookings/${bookingId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to mark session as completed");
        return res.json();
      })
      .then(() => {
        toast({
          title: "Session completed",
          description: "Your session has been marked as completed.",
        });
      })
      .catch(error => {
        console.error("Error completing session:", error);
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this session. Please log in to continue.
          </p>
          <Button onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Not Found</h2>
          <p className="text-gray-600 mb-6">The session you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const otherParticipant = booking.mentorId === user?.id ? booking.student : booking.mentor;

  return (
    <>
      <Helmet>
        <title>Video Session | MentorConnect</title>
      </Helmet>

      <div className="bg-gray-900 min-h-screen flex flex-col">
        {sessionStarted ? (
          <div className="flex-1">
            <VideoCall sessionId={sessionId} onEndCall={handleEndCall} />
          </div>
        ) : isCallEnded ? (
          <div className="flex items-center justify-center min-h-screen">
            <Card className="max-w-md w-full">
              <CardContent className="pt-6 pb-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Ended</h2>
                <p className="text-gray-600 mb-6">
                  Your session with {otherParticipant.name} has been completed.
                </p>
                <div className="space-y-3">
                  <Button onClick={() => navigate("/dashboard")} className="w-full">
                    Back to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/messages?mentor=${booking.mentorId}`)}
                    className="w-full"
                  >
                    Message {otherParticipant.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="max-w-md w-full">
              <CardContent className="pt-6 pb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Session?</h2>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
                  <h3 className="font-medium text-gray-900 mb-2">Session Details</h3>
                  <p className="text-gray-700">
                    <strong>With:</strong> {otherParticipant.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Date & Time:</strong> {new Date(booking.startTime).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                    })}, {' '}
                    {new Date(booking.startTime).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                  <p className="text-gray-700">
                    <strong>Duration:</strong> 45-60 minutes
                  </p>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Make sure your camera and microphone are working before joining the call.
                </p>
                
                <Button onClick={handleStartSession} className="w-full">
                  Join Video Call
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
