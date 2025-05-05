import { CheckCircle2, Users, Calendar, Video, Target, Tag, Award, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HowItWorks() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            How Our Mentorship Works
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Connect with experienced professionals and seniors from your target universities or dream companies for personalized guidance.
          </p>
        </div>

        {/* Main Process Flow */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/30 to-primary"></div>
          
          {/* Step 1: Find a Mentor */}
          <div className="relative mb-20">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="md:col-start-1 flex flex-col items-center md:items-end text-center md:text-right pr-0 md:pr-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 max-w-md">
                  <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 mx-auto md:ml-auto md:mr-0">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Find Your Perfect Mentor</h3>
                  <p className="text-gray-600">
                    Browse our curated list of verified mentors from top universities and companies. 
                    Filter by university, company, expertise, and more to find someone who matches your needs.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex md:col-start-2 items-center justify-start">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                  alt="Students browsing mentors"
                  className="rounded-lg shadow-md w-full max-w-md h-64 object-cover" 
                />
              </div>
              {/* Timeline dot for step 1 */}
              <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white shadow"></div>
            </div>
          </div>

          {/* Step 2: Book a Session */}
          <div className="relative mb-20">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="hidden md:flex md:col-start-1 items-center justify-end">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Booking a mentorship session"
                  className="rounded-lg shadow-md w-full max-w-md h-64 object-cover" 
                />
              </div>
              <div className="md:col-start-2 flex flex-col items-center md:items-start text-center md:text-left pl-0 md:pl-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 max-w-md">
                  <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 mx-auto md:mr-auto md:ml-0">
                    <Calendar className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Book Your Session</h3>
                  <p className="text-gray-600">
                    Choose a convenient time slot from your mentor's availability calendar and book 
                    a one-on-one 60-minute session for ₹1500.
                  </p>
                  <div className="mt-4 inline-flex items-center text-primary">
                    <Tag className="mr-2 h-5 w-5" />
                    <span className="font-semibold">₹1500 per session</span>
                  </div>
                </div>
              </div>
              {/* Timeline dot for step 2 */}
              <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white shadow"></div>
            </div>
          </div>

          {/* Step 3: Attend Session */}
          <div className="relative mb-20">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="md:col-start-1 flex flex-col items-center md:items-end text-center md:text-right pr-0 md:pr-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 max-w-md">
                  <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 mx-auto md:ml-auto md:mr-0">
                    <Video className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Attend Your Session</h3>
                  <p className="text-gray-600">
                    Connect with your mentor through our integrated video platform for 
                    personalized guidance. Discuss your goals, challenges, and questions in a private one-on-one setting.
                  </p>
                  <div className="mt-4 inline-flex items-center text-green-600">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    <span className="font-medium">Free built-in video calls</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex md:col-start-2 items-center justify-start">
                <img 
                  src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Video mentorship session"
                  className="rounded-lg shadow-md w-full max-w-md h-64 object-cover" 
                />
              </div>
              {/* Timeline dot for step 3 */}
              <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white shadow"></div>
            </div>
          </div>

          {/* Step 4: Get Follow-up & Leave Review */}
          <div className="relative mb-20">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="hidden md:flex md:col-start-1 items-center justify-end">
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Student leaving review"
                  className="rounded-lg shadow-md w-full max-w-md h-64 object-cover" 
                />
              </div>
              <div className="md:col-start-2 flex flex-col items-center md:items-start text-center md:text-left pl-0 md:pl-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 max-w-md">
                  <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 mx-auto md:mr-auto md:ml-0">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Continue Your Growth</h3>
                  <p className="text-gray-600">
                    After your session, stay connected with your mentor for follow-up questions 
                    via our messaging system. Leave a review to help others find great mentors too.
                  </p>
                </div>
              </div>
              {/* Timeline dot for step 4 */}
              <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white shadow"></div>
            </div>
          </div>
        </div>

        {/* Group Sessions Section */}
        <div className="mt-20 mb-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:grid lg:grid-cols-2 lg:gap-x-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Group Mentorship Sessions
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Looking for more affordable options? Join our group mentorship sessions!
                </p>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Free Webinars</h3>
                      <p className="mt-1 text-gray-600">
                        Access free webinars hosted by our top mentors on various subjects from career guidance to skill development.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Low-Cost Workshops</h3>
                      <p className="mt-1 text-gray-600">
                        Join interactive workshops for just ₹299-₹499, focusing on specific skills and knowledge areas.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Community Q&A Sessions</h3>
                      <p className="mt-1 text-gray-600">
                        Participate in monthly community Q&A sessions where mentors answer common questions in an open format.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/group-sessions">
                    <Button size="lg" variant="default">
                      <Users className="mr-2 h-5 w-5" />
                      Explore Group Sessions
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-12 lg:mt-0 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Group mentorship session"
                  className="rounded-lg shadow-lg object-cover h-80 w-full" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ready to elevate your career and knowledge?
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Whether through one-on-one mentorship or group sessions, we're here to help you grow.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/find-mentors" className="mx-2">
              <Button size="lg">
                Find a Mentor
              </Button>
            </Link>
            <Link href="/group-sessions" className="mx-2">
              <Button size="lg" variant="outline">
                <Users className="mr-2 h-5 w-5" />
                Join Group Session
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}