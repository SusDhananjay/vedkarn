import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Mentor, Slot, Review } from "@shared/schema";

interface MentorDetailProps {
  mentorId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function MentorDetail({ mentorId, isOpen, onClose }: MentorDetailProps) {
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { data: mentor, isLoading } = useQuery<Mentor>({
    queryKey: [`/api/mentors/${mentorId}`],
    enabled: isOpen,
  });

  const { data: slots } = useQuery<Slot[]>({
    queryKey: [`/api/mentors/${mentorId}/slots`],
    enabled: isOpen,
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: [`/api/mentors/${mentorId}/reviews`],
    enabled: isOpen,
  });

  const displayedSlots = showAllSlots ? slots : slots?.slice(0, 6);
  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 2);

  if (isLoading || !mentor) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-20 w-20">
              <img 
                className="h-20 w-20 rounded-full object-cover" 
                src={mentor.profilePicture || "https://via.placeholder.com/150"} 
                alt={`${mentor.name}'s profile picture`} 
              />
            </div>
            <div className="ml-5">
              <DialogTitle className="text-2xl font-bold">
                {mentor.name}
              </DialogTitle>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                <span>{mentor.university}</span>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{mentor.company}, {mentor.title}</span>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500">{mentor.rating.toFixed(1)}</span>
                <div className="ml-1 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(mentor.rating) ? 'text-accent-500 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-500">({mentor.reviewCount} sessions)</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">About</h3>
            <p className="mt-2 text-sm text-gray-500">
              {mentor.bio}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Expertise</h3>
            <div className="mt-2 flex flex-wrap">
              {mentor.expertise && mentor.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary" className="m-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Languages</h3>
            <div className="mt-2 flex flex-wrap">
              {mentor.languages && mentor.languages.map((language, index) => (
                <Badge key={index} variant="outline" className="m-1">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Available Slots</h3>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {slots && slots.length > 0 ? (
                displayedSlots?.map((slot) => (
                  <Button 
                    key={slot.id} 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => window.location.href = `/book/${mentor.id}?slot=${slot.id}`}
                  >
                    {new Date(slot.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, 
                    {new Date(slot.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </Button>
                ))
              ) : (
                <p className="col-span-3 text-sm text-gray-500">No available slots at the moment.</p>
              )}
            </div>
            {slots && slots.length > 6 && (
              <Button 
                variant="link" 
                className="mt-2 text-sm p-0 h-auto"
                onClick={() => setShowAllSlots(!showAllSlots)}
              >
                {showAllSlots ? 'Show fewer times' : 'View more available times'}
              </Button>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
            <div className="mt-2 space-y-4">
              {reviews && reviews.length > 0 ? (
                displayedReviews?.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img 
                          className="h-8 w-8 rounded-full object-cover" 
                          src={review.studentPicture || "https://via.placeholder.com/150"} 
                          alt="Student profile picture" 
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{review.studentName}</p>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'text-accent-500 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              )}
            </div>
            {reviews && reviews.length > 2 && (
              <Button 
                variant="link" 
                className="mt-2 text-sm p-0 h-auto"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? 'Show fewer reviews' : `Read all ${reviews.length} reviews`}
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href={`/book/${mentor.id}`} className="w-full sm:flex-1">
            <Button className="w-full">
              Book Session (₹1500)
            </Button>
          </Link>
          <Link href={`/messages?mentor=${mentor.id}`} className="w-full sm:flex-1">
            <Button variant="outline" className="w-full">
              Message
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
