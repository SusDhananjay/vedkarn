import { Helmet } from "react-helmet";
import MentorSearch from "@/components/mentors/MentorSearch";
import { ArrowRight, BookOpen, Clock, MessageSquare, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FindMentors() {
  return (
    <div>
      <Helmet>
        <title>Find Mentors | MentorConnect</title>
        <meta name="description" content="Find and connect with experienced mentors from top universities and companies for personalized guidance." />
      </Helmet>
      
      {/* Value proposition banner */}
      <div className="bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Accelerate Your Growth with Expert Mentorship
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Connect with mentors from your dream institutions and companies for personalized guidance on your academic and career journey.
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                      <BookOpen className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Insider Knowledge</h2>
                    <p className="mt-2 text-sm text-gray-500">Get advice directly from people who've walked the path you aspire to.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                      <Video className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">1:1 Video Sessions</h2>
                    <p className="mt-2 text-sm text-gray-500">Personalized 60-minute video calls with your chosen mentor.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Flexible Scheduling</h2>
                    <p className="mt-2 text-sm text-gray-500">Book sessions at times that work for your schedule.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Post-session Support</h2>
                    <p className="mt-2 text-sm text-gray-500">Follow-up messaging with your mentor after sessions.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex">
                <Link href="/become-a-mentor">
                  <Button variant="outline" className="mr-4">
                    Become a Mentor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#mentors">
                  <Button>
                    Find Your Mentor
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-2">
                  <div className="w-full h-full mx-auto opacity-30 blur-lg filter bg-gradient-to-r from-pink-400 to-primary-400"></div>
                </div>
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Mentorship session" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-gray-500">Verified Mentors</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-primary">4.8</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-primary">₹1500</div>
                  <div className="text-sm text-gray-500">Per Session</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section anchor for mentors list */}
      <div id="mentors">
        <MentorSearch />
      </div>
    </div>
  );
}
