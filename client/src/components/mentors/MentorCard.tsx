import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Mentor } from "@shared/schema";

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16">
            <img 
              className="h-16 w-16 rounded-full object-cover" 
              src={mentor.profilePicture || "https://via.placeholder.com/150"} 
              alt={`${mentor.name}'s profile picture`} 
            />
          </div>
          <div className="ml-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {mentor.name}
            </h3>
            <div className="mt-1 flex items-center text-sm text-gray-500">
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
              <span>{mentor.company}</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex flex-wrap">
            {mentor.expertise && mentor.expertise.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="m-1">
                {skill}
              </Badge>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500 line-clamp-3">
            {mentor.bio}
          </p>
        </div>
        <div className="mt-5 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">{mentor.rating.toFixed(1)}</span>
            <div className="ml-1 flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(mentor.rating) ? 'text-accent-500 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-500">({mentor.reviewCount})</span>
          </div>
          <span className="text-primary font-medium">₹1500/session</span>
        </div>
        <div className="mt-4">
          <Link href={`/mentor/${mentor.id}`}>
            <Button className="w-full flex justify-center items-center">
              View Profile & Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
