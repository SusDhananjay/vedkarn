import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  GraduationCap, 
  Briefcase, 
  Calendar,
  Tag,
  CheckCircle2
} from "lucide-react";
import { Mentor } from "@shared/schema";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Default avatar image using initials
const getInitialsAvatar = (name: string) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
    
  // Generate a consistent color based on the name
  const hue = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
  const color = `hsl(${hue}, 70%, 40%)`;
  
  return (
    <div 
      className="h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-xl"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const isNewMentor = new Date(mentor.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000; // Added in the last 24h
  
  // Calculate fullness of stars for rating
  const fullStars = Math.floor(mentor.rating);
  const hasHalfStar = mentor.rating - fullStars >= 0.5;
  
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 transition-all hover:shadow-md relative group">
      {/* New mentor badge */}
      {isNewMentor && (
        <div className="absolute top-3 right-3 bg-pink-50 text-pink-700 text-xs font-medium px-2 py-1 rounded-full border border-pink-200 flex items-center">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
          </span>
          New Mentor
        </div>
      )}
      
      <div className="px-5 py-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-20 w-20">
            {mentor.profilePicture ? (
              <img 
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-100 shadow" 
                src={mentor.profilePicture} 
                alt={`${mentor.name}'s profile picture`} 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.appendChild(
                    document.createRange().createContextualFragment(
                      `<div class="h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-xl bg-primary">${mentor.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}</div>`
                    )
                  );
                }}
              />
            ) : (
              getInitialsAvatar(mentor.name)
            )}
          </div>
          <div className="ml-5">
            <h3 className="text-lg leading-6 font-semibold text-gray-900 flex items-center">
              {mentor.name}
              {mentor.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CheckCircle2 className="h-4 w-4 text-primary ml-1.5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified Mentor</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h3>
            <p className="text-sm font-medium text-gray-700">{mentor.title}</p>
            <div className="mt-1.5 flex items-center text-sm text-gray-500">
              <GraduationCap className="flex-shrink-0 mr-1.5 h-3.5 w-3.5" />
              <span>{mentor.university}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Briefcase className="flex-shrink-0 mr-1.5 h-3.5 w-3.5" />
              <span>{mentor.company}</span>
            </div>
          </div>
        </div>
        
        {/* Expertise tags */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-1.5">
            {mentor.expertise && mentor.expertise.slice(0, 3).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
              >
                {skill}
              </Badge>
            ))}
            {mentor.expertise && mentor.expertise.length > 3 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="bg-white cursor-help"
                    >
                      +{mentor.expertise.length - 3} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="font-medium mb-1">All expertise areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-transparent">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          {/* Bio with line clamp */}
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {mentor.bio}
          </p>
        </div>
        
        {/* Rating and price */}
        <div className="mt-5 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-1.5">{mentor.rating.toFixed(1)}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4", 
                    i < fullStars ? "text-yellow-400 fill-current" : 
                    i === fullStars && hasHalfStar ? "text-yellow-400 fill-yellow-400 fill-opacity-50" : 
                    "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="ml-1.5 text-sm text-gray-500">
              ({mentor.reviewCount})
            </span>
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-primary mr-1" />
            <span className="text-primary font-semibold">₹1500 <span className="text-sm font-normal">/session</span></span>
          </div>
        </div>
        
        {/* Duration and button */}
        <div className="mt-2 mb-1 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>60 mins session</span>
          </div>
          
          <span className="text-xs text-gray-400">
            {mentor.languages?.join(', ')}
          </span>
        </div>
        
        <div className="mt-4">
          <Link href={`/mentor/${mentor.id}`}>
            <Button 
              className="w-full flex justify-center items-center group-hover:bg-primary-600 transition-colors"
            >
              View Profile & Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
