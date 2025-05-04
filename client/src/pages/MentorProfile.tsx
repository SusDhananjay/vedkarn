import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Calendar, Mail, GraduationCap, Briefcase, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Mentor } from "@shared/schema";

export default function MentorProfile() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const mentorId = parseInt(id);

  const { data: mentor, isLoading, error } = useQuery<Mentor>({
    queryKey: [`/api/mentors/${mentorId}`],
    enabled: !!mentorId && !isNaN(mentorId),
  });

  const [selectedTab, setSelectedTab] = useState("about");

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading mentor profile",
        description: "Could not load the mentor profile. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
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
          <p className="text-gray-600 mb-6">The mentor you're looking for doesn't exist or has been removed.</p>
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
        <title>{mentor.name} | MentorConnect</title>
      </Helmet>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Mentor Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src={mentor.profilePicture} alt={mentor.name} />
              <AvatarFallback className="text-2xl">
                {mentor.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{mentor.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2">
                <div className="flex items-center text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  <span>{mentor.university}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>{mentor.company}, {mentor.title}</span>
                </div>
              </div>

              <div className="flex items-center mt-2">
                <span className="text-gray-700 font-medium">{mentor.rating.toFixed(1)}</span>
                <div className="flex mx-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(mentor.rating) ? 'text-accent-500 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-500">({mentor.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href={`/book/${mentor.id}`}>
                <Button className="w-full sm:w-auto">
                  Book Session (₹1500)
                </Button>
              </Link>
              <Link href={`/messages?mentor=${mentor.id}`}>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Mail className="mr-2 h-4 w-4" /> Message
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "about"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTab("about")}
              >
                About
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "expertise"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTab("expertise")}
              >
                Expertise
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "availability"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTab("availability")}
              >
                Availability
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "reviews"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTab("reviews")}
              >
                Reviews
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg">
            {/* About Tab */}
            {selectedTab === "about" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 mb-8 whitespace-pre-line">{mentor.bio}</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {mentor.languages && mentor.languages.map((language, index) => (
                    <Badge key={index} variant="outline">{language}</Badge>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                <div className="mb-8">
                  <div className="flex items-start mb-2">
                    <GraduationCap className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{mentor.university}</p>
                      {mentor.degree && <p className="text-gray-600">{mentor.degree}</p>}
                      {mentor.graduationYear && <p className="text-gray-500 text-sm">Class of {mentor.graduationYear}</p>}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Work Experience</h3>
                <div>
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{mentor.title}</p>
                      <p className="text-gray-600">{mentor.company}</p>
                      {mentor.experience && <p className="text-gray-500 text-sm">{mentor.experience} years of experience</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expertise Tab */}
            {selectedTab === "expertise" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {mentor.expertise && mentor.expertise.map((skill, index) => (
                    <Badge key={index} className="bg-primary-100 text-primary-800 hover:bg-primary-200">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-semibold text-gray-900 mb-4">How I Can Help You</h3>
                <ul className="space-y-3 text-gray-700">
                  {mentor.mentorshipAreas && mentor.mentorshipAreas.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 mr-2">
                        {index + 1}
                      </span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Availability Tab */}
            {selectedTab === "availability" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Availability</h2>
                <p className="text-gray-600 mb-6">
                  Select from the available time slots below. All sessions are 45-60 minutes long and cost ₹1500.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {mentor.availableSlots && mentor.availableSlots.length > 0 ? (
                    mentor.availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() => navigate(`/book/${mentor.id}?slot=${slot.id}`)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                          {new Date(slot.startTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}, {' '}
                          {new Date(slot.startTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-full p-6 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-500">No upcoming available slots. Please check back later.</p>
                    </div>
                  )}
                </div>

                <Link href={`/book/${mentor.id}`}>
                  <Button>
                    View All Available Slots
                  </Button>
                </Link>
              </div>
            )}

            {/* Reviews Tab */}
            {selectedTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 mr-2">{mentor.rating.toFixed(1)}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(mentor.rating) ? 'text-accent-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-500">({mentor.reviewCount})</span>
                  </div>
                </div>

                {mentor.reviews && mentor.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {mentor.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.studentPicture} alt={review.studentName} />
                            <AvatarFallback>{review.studentName.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <h4 className="font-medium text-gray-900">{review.studentName}</h4>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? 'text-accent-500 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="mt-3 text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-500">No reviews yet for this mentor.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Session CTA */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Ready to connect with {mentor.name}?</h3>
              <p className="mt-1 text-gray-600">Book a 45-60 minute one-on-one session for ₹1500</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href={`/book/${mentor.id}`}>
                <Button size="lg">Book a Session</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
