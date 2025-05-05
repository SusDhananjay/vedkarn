import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Calendar, Tag, Filter, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function GroupSessions() {
  // Sample data for demonstration
  const upcomingSessions = [
    {
      id: 1,
      title: "Getting into Top-Tier Universities: Application Strategies",
      mentor: "Priya Sharma",
      mentorTitle: "Admissions Counselor, IIT Delhi",
      date: "May 10, 2025",
      time: "3:00 PM - 4:30 PM IST",
      price: "Free",
      attendees: 42,
      maxAttendees: 100,
      tags: ["College Admissions", "Application Tips"]
    },
    {
      id: 2,
      title: "Tech Interview Preparation Workshop",
      mentor: "Rajiv Mehta",
      mentorTitle: "Senior Engineer, Google",
      date: "May 12, 2025",
      time: "6:00 PM - 8:00 PM IST",
      price: "₹299",
      attendees: 28,
      maxAttendees: 50,
      tags: ["Interview Prep", "Coding", "Career"]
    },
    {
      id: 3,
      title: "Mastering Product Management Fundamentals",
      mentor: "Neha Kapoor",
      mentorTitle: "Product Manager, Amazon",
      date: "May 15, 2025",
      time: "5:00 PM - 6:30 PM IST",
      price: "₹499",
      attendees: 35,
      maxAttendees: 60,
      tags: ["Product Management", "Career Switch"]
    }
  ];

  const workshops = [
    {
      id: 4,
      title: "AI and Machine Learning: A Practical Introduction",
      mentor: "Dr. Arun Kumar",
      mentorTitle: "AI Researcher, Microsoft",
      date: "May 18, 2025",
      time: "10:00 AM - 1:00 PM IST",
      price: "₹499",
      attendees: 22,
      maxAttendees: 40,
      tags: ["AI/ML", "Technical Skills"]
    },
    {
      id: 5,
      title: "Financial Planning for Young Professionals",
      mentor: "Vikram Shah",
      mentorTitle: "Financial Advisor, HDFC Bank",
      date: "May 20, 2025",
      time: "7:00 PM - 8:30 PM IST",
      price: "₹399",
      attendees: 15,
      maxAttendees: 50,
      tags: ["Finance", "Personal Growth"]
    }
  ];

  const freeWebinars = [
    {
      id: 6,
      title: "Career Opportunities in Data Science",
      mentor: "Ananya Desai",
      mentorTitle: "Data Scientist, IBM",
      date: "May 22, 2025",
      time: "4:00 PM - 5:00 PM IST",
      price: "Free",
      attendees: 85,
      maxAttendees: 200,
      tags: ["Data Science", "Career"]
    },
    {
      id: 7,
      title: "Resume Building and LinkedIn Optimization",
      mentor: "Sanjay Verma",
      mentorTitle: "HR Manager, Infosys",
      date: "May 25, 2025",
      time: "11:00 AM - 12:00 PM IST",
      price: "Free",
      attendees: 95,
      maxAttendees: 150,
      tags: ["Resume", "LinkedIn", "Job Search"]
    }
  ];

  const renderSessionCard = (session: any) => (
    <Card key={session.id} className="overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{session.title}</CardTitle>
            <CardDescription className="mt-1">{session.mentor} • {session.mentorTitle}</CardDescription>
          </div>
          <Badge variant={session.price === "Free" ? "outline" : "secondary"} className={session.price === "Free" ? "bg-green-50 text-green-700 border-green-200" : "bg-primary/10 text-primary border-primary/20"}>
            {session.price}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center text-gray-600 mb-3">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{session.date} • {session.time}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <Users className="h-4 w-4 mr-2" />
          <span>{session.attendees} attending • {session.maxAttendees - session.attendees} spots left</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {session.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="outline" className="bg-gray-50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 bg-gray-50 flex justify-end">
        <Button variant="default" size="sm">
          Register Now
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Group Sessions & Workshops
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Learn from top mentors in an interactive group setting at a fraction of the cost of one-on-one mentorship.
          </p>
          <div className="mt-4 flex justify-center">
            <Badge variant="secondary" className="mr-2 bg-white border-pink-200">
              <Tag className="mr-1.5 h-3.5 w-3.5 text-pink-500" />
              Free & affordable options
            </Badge>
            <Badge variant="secondary" className="mr-2 bg-white border-pink-200">
              <Users className="mr-1.5 h-3.5 w-3.5 text-pink-500" />
              Interactive group learning
            </Badge>
            <Badge variant="secondary" className="bg-white border-pink-200">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-pink-500" />
              Live sessions with Q&A
            </Badge>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10 bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-grow max-w-xl w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by topic, mentor, or keyword..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <select className="border border-gray-200 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Topics</option>
              <option>Career</option>
              <option>Technical Skills</option>
              <option>Education</option>
              <option>Personal Growth</option>
            </select>
            <select className="border border-gray-200 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Price: All</option>
              <option>Free</option>
              <option>Under ₹300</option>
              <option>₹300-₹500</option>
            </select>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="upcoming" className="mb-12">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="webinars">Free Webinars</TabsTrigger>
            <TabsTrigger value="recorded">Recorded Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map(session => renderSessionCard(session))}
            </div>
          </TabsContent>
          
          <TabsContent value="workshops">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map(session => renderSessionCard(session))}
            </div>
          </TabsContent>
          
          <TabsContent value="webinars">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeWebinars.map(session => renderSessionCard(session))}
            </div>
          </TabsContent>
          
          <TabsContent value="recorded">
            <div className="py-12 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">Recorded Sessions Coming Soon</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  We're working on adding a library of recorded sessions. Check back soon!
                </p>
              </div>
              <Button variant="outline">Get Notified When Available</Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Looking for personalized guidance?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Group sessions are great for general learning, but sometimes you need 
              one-on-one attention to address your specific needs.
            </p>
            <Link href="/find-mentors">
              <Button size="lg">
                Find a One-on-One Mentor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}