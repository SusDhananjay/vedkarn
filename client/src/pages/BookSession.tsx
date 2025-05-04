import { useState, useEffect } from "react";
import { useParams, useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import BookingCalendar from "@/components/booking/BookingCalendar";
import PaymentForm from "@/components/booking/PaymentForm";
import { Mentor, Slot } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export default function BookSession() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/book/:id");
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  
  const mentorId = parseInt(id);

  // Parse slot from query parameters if available
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const slotId = queryParams.get("slot");
    if (slotId) {
      // Fetch the slot details if a slot ID is provided
      fetch(`/api/slots/${slotId}`)
        .then(res => res.json())
        .then(data => {
          setSelectedSlot(data);
        })
        .catch(error => {
          console.error("Error fetching slot:", error);
        });
    }
  }, []);

  const { data: mentor, isLoading: isMentorLoading } = useQuery<Mentor>({
    queryKey: [`/api/mentors/${mentorId}`],
    enabled: !!mentorId && !isNaN(mentorId),
  });

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleContinueToPayment = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (selectedSlot) {
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      toast({
        title: "Please select a time slot",
        description: "You need to select an available time slot to continue.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = (newBookingId: number) => {
    setBookingId(newBookingId);
    setBookingCompleted(true);
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    toast({
      title: "Successfully logged in",
      description: "You can now continue with your booking.",
    });
  };

  if (isMentorLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mentor Not Found</h2>
          <p className="text-gray-600 mb-6">The mentor you're trying to book doesn't exist or has been removed.</p>
          <Link href="/find-mentors">
            <Button>Browse All Mentors</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book a Session with {mentor.name} | MentorConnect</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setLocation(`/mentor/${mentor.id}`)} className="flex items-center text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mentor Profile
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center w-full max-w-3xl">
                <div className={`flex-1 h-1 ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} mx-2`}>
                  1
                </div>
                <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} mx-2`}>
                  2
                </div>
                <div className={`flex-1 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} mx-2`}>
                  3
                </div>
                <div className={`flex-1 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-center mt-2">
              <div className="flex items-center w-full max-w-3xl text-sm">
                <div className="flex-1 text-center">Select Time</div>
                <div className="flex-1 text-center">Payment</div>
                <div className="flex-1 text-center">Confirmation</div>
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Booking Content */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  {/* Step 1: Select Time */}
                  {step === 1 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a Time</h2>
                      <p className="text-gray-600 mb-6">
                        Choose a time that works for you to connect with {mentor.name}.
                      </p>
                      
                      <BookingCalendar 
                        mentorId={mentor.id} 
                        onSlotSelect={handleSlotSelect} 
                        selectedSlot={selectedSlot}
                      />
                      
                      <div className="mt-8">
                        <Button 
                          onClick={handleContinueToPayment} 
                          disabled={!selectedSlot}
                          className="w-full"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Payment */}
                  {step === 2 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Details</h2>
                      <p className="text-gray-600 mb-6">
                        Complete your payment to secure your session with {mentor.name}.
                      </p>
                      
                      {selectedSlot && (
                        <div className="bg-primary-50 p-4 rounded-md mb-6">
                          <h3 className="font-medium text-primary-900">Selected Session</h3>
                          <p className="text-primary-700 mt-1">
                            {new Date(selectedSlot.startTime).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric',
                            })}, {' '}
                            {new Date(selectedSlot.startTime).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })} - {new Date(selectedSlot.endTime).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </p>
                        </div>
                      )}
                      
                      <PaymentForm 
                        mentorId={mentor.id} 
                        slotId={selectedSlot?.id || 0}
                        onSuccess={handlePaymentSuccess}
                      />
                      
                      <div className="mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => setStep(1)}
                          className="w-full"
                        >
                          Back to Time Selection
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirmation */}
                  {step === 3 && (
                    <div className="text-center py-6">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                      <p className="text-gray-600 mb-6">
                        Your session with {mentor.name} has been successfully booked.
                      </p>
                      
                      {selectedSlot && (
                        <div className="bg-primary-50 p-4 rounded-md mb-6 inline-block text-left">
                          <h3 className="font-medium text-primary-900">Session Details</h3>
                          <p className="text-primary-700 mt-1">
                            <strong>Date & Time:</strong> {new Date(selectedSlot.startTime).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric',
                            })}, {' '}
                            {new Date(selectedSlot.startTime).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </p>
                          <p className="text-primary-700">
                            <strong>Duration:</strong> 45-60 minutes
                          </p>
                          <p className="text-primary-700">
                            <strong>Booking ID:</strong> {bookingId}
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-4 mt-8">
                        <Link href="/dashboard">
                          <Button className="w-full">
                            Go to Dashboard
                          </Button>
                        </Link>
                        <Link href={`/messages?mentor=${mentor.id}`}>
                          <Button variant="outline" className="w-full">
                            Message {mentor.name}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Mentor Summary */}
            <div>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.profilePicture} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-600">{mentor.title} at {mentor.company}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-700">{mentor.rating.toFixed(1)}</span>
                        <div className="ml-1 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(mentor.rating) ? 'text-accent-500 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">({mentor.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <h4 className="font-medium text-gray-900 mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mentor.expertise && mentor.expertise.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise && mentor.expertise.length > 4 && (
                      <span className="text-xs text-gray-500">+{mentor.expertise.length - 4} more</span>
                    )}
                  </div>

                  <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mentor.languages && mentor.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-primary-100 mr-2 mt-0.5"></span>
                        <span>45-60 minute 1:1 video session</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-primary-100 mr-2 mt-0.5"></span>
                        <span>Personalized guidance and advice</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-primary-100 mr-2 mt-0.5"></span>
                        <span>Opportunity to ask questions</span>
                      </li>
                    </ul>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Price</h4>
                    <p className="text-2xl font-bold text-gray-900">₹1,500</p>
                    <p className="text-sm text-gray-500">Fixed price per session</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultTab="login"
      />
    </>
  );
}
