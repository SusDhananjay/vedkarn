import { Search, Calendar, Video, MessageCircle, ThumbsUp, Award, Users, Lightbulb, BookOpen, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Your Path to Success
          </p>
          <p className="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
            Connect with experienced mentors who've been where you want to go. Get personalized guidance in just a few simple steps.
          </p>
        </div>

        {/* Main Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 mb-20">
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-50 text-primary mb-6 mx-auto">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-4">1. Find Your Mentor</h3>
              <p className="text-gray-600 text-center mb-6">
                Browse profiles of mentors from top universities and companies. Filter by expertise, language, and availability to find your perfect match.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>500+ verified mentors from IITs, IIMs, and top companies</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Detailed profiles with expertise, education, and work experience</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Genuine reviews from past mentees</span>
                </li>
              </ul>
            </div>
            <div className="px-8 pb-8 pt-2">
              <Link href="/find-mentors">
                <Button variant="outline" className="w-full">Browse Mentors</Button>
              </Link>
            </div>
          </div>

          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <div className="p-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-50 text-primary mb-6 mx-auto">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-4">2. Book a Session</h3>
              <p className="text-gray-600 text-center mb-6">
                Select a suitable time slot from your mentor's calendar and book a personalized one-hour session for just ₹1500.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Convenient, flexible scheduling</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Secure payment through Indian payment gateways</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Instant booking confirmation</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Flat fee of ₹1500 per hour session - no hidden charges</span>
                </li>
              </ul>
            </div>
            <div className="px-8 pb-8 pt-2">
              <Link href="/find-mentors">
                <Button className="w-full">Book Now</Button>
              </Link>
            </div>
          </div>

          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-50 text-primary mb-6 mx-auto">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-4">3. Connect & Learn</h3>
              <p className="text-gray-600 text-center mb-6">
                Join your mentor for a 1-on-1 video session. Ask questions, get personalized advice, and build a valuable connection.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>HD video calls with screen sharing capabilities</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>No downloads required - works in your browser</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Messaging system to stay in touch before/after sessions</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Option to book follow-up sessions with favorite mentors</span>
                </li>
              </ul>
            </div>
            <div className="px-8 pb-8 pt-2">
              <Link href="/how-it-works">
                <Button variant="outline" className="w-full">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12">What Makes Our Platform Special</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="rounded-full h-14 w-14 flex items-center justify-center bg-primary-50 text-primary mx-auto mb-4">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h4 className="font-semibold mb-2">Premier Institutions</h4>
              <p className="text-sm text-gray-500">Mentors from top colleges like IITs, IIMs, NITs, and prestigious universities worldwide</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="rounded-full h-14 w-14 flex items-center justify-center bg-primary-50 text-primary mx-auto mb-4">
                <Briefcase className="h-7 w-7" />
              </div>
              <h4 className="font-semibold mb-2">Industry Leaders</h4>
              <p className="text-sm text-gray-500">Professionals from Google, Microsoft, Amazon, McKinsey, and other leading companies</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="rounded-full h-14 w-14 flex items-center justify-center bg-primary-50 text-primary mx-auto mb-4">
                <MessageCircle className="h-7 w-7" />
              </div>
              <h4 className="font-semibold mb-2">Personalized Guidance</h4>
              <p className="text-sm text-gray-500">1-on-1 sessions tailored to your specific goals and questions</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="rounded-full h-14 w-14 flex items-center justify-center bg-primary-50 text-primary mx-auto mb-4">
                <Lightbulb className="h-7 w-7" />
              </div>
              <h4 className="font-semibold mb-2">Diverse Mentorship</h4>
              <p className="text-sm text-gray-500">Academic guidance, career advice, technical skills, interview prep, and more</p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="md:flex">
            <div className="p-8 md:w-1/2">
              <div className="uppercase tracking-wide text-sm text-primary font-semibold">Success Story</div>
              <p className="mt-2 block text-lg leading-tight font-medium text-black">
                "The mentorship session completely changed my approach to IIT preparation"
              </p>
              <p className="mt-4 text-gray-500">
                "I was struggling with JEE Advanced preparation and didn't know how to improve my score. 
                After just one session with my mentor from IIT Bombay, I got a clear roadmap and insider 
                tips that I couldn't find anywhere else. Their guidance on tackling the toughest topics 
                and time management strategies made a huge difference. I'm now confident about cracking JEE!"
              </p>
              <div className="mt-6 flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg">R</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Rahul Kumar</p>
                  <p className="text-xs text-gray-500">JEE Aspirant, Delhi</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-primary-50 flex items-center justify-center px-8 py-12">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">Find your mentor and book your first session today</p>
                <Link href="/find-mentors">
                  <Button size="lg" className="w-full">Find Your Mentor</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Group Session Promotion */}
        <div className="bg-primary-50 rounded-xl shadow-md overflow-hidden mb-16">
          <div className="md:flex items-center">
            <div className="md:w-2/3 p-8">
              <div className="uppercase tracking-wide text-sm text-primary font-semibold">Affordable Alternative</div>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">Group Sessions</h3>
              <p className="mt-2 text-gray-600">
                Can't afford a one-on-one session? Join our low-cost or free group sessions 
                led by the same expert mentors. Learn alongside peers with similar goals.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-white rounded-full px-3 py-1 text-sm border border-primary/20 text-primary-700 flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>Interactive group learning</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 text-sm border border-primary/20 text-primary-700 flex items-center">
                  <BookOpen className="h-3.5 w-3.5 mr-1" />
                  <span>Free webinars</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 text-sm border border-primary/20 text-primary-700 flex items-center">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  <span>Low-cost workshops</span>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/group-sessions">
                  <Button className="mr-3">
                    <Users className="mr-2 h-4 w-4" />
                    Explore Group Sessions
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 p-8 hidden md:block">
              <div className="bg-primary/5 rounded-xl h-full flex items-center justify-center p-4">
                <img
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Group mentorship session"
                  className="rounded-lg shadow-md object-cover h-40 w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Teasers */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Have Questions?</h3>
          <p className="text-gray-500 mt-2">Check out our <a href="#faq" className="text-primary hover:underline">Frequently Asked Questions</a> or visit our <Link href="/how-it-works" className="text-primary hover:underline">detailed guide</Link></p>
        </div>
      </div>
    </section>
  );
}
