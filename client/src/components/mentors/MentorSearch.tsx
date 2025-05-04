import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, GraduationCap, Filter, Star, Users } from "lucide-react";
import MentorCard from "./MentorCard";
import { Mentor } from "@shared/schema";
import { EXPERTISE_AREAS, LANGUAGES, POPULAR_UNIVERSITIES, POPULAR_COMPANIES } from "@/lib/constants";

export default function MentorSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    university: "",
    company: "",
    expertise: "",
    language: "",
    rating: "",
  });
  
  // Fix type for expertise to handle array data from API
  const [selectedExpertise, setSelectedExpertise] = useState("");

  const { data: allMentors, isLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
    enabled: true,
  });
  
  // Filter mentors based on the selected filters
  const mentors = allMentors?.filter(mentor => {
    // Filter by university
    if (filters.university && mentor.university !== filters.university) {
      return false;
    }
    
    // Filter by company
    if (filters.company && mentor.company !== filters.company) {
      return false;
    }
    
    // Filter by expertise - check if the mentor has the selected expertise in their array
    if (filters.expertise && (!mentor.expertise || !mentor.expertise.includes(filters.expertise))) {
      return false;
    }
    
    // Filter by language
    if (filters.language && (!mentor.languages || !mentor.languages.includes(filters.language))) {
      return false;
    }
    
    // Filter by rating
    if (filters.rating && mentor.rating < parseFloat(filters.rating)) {
      return false;
    }
    
    // Filter by search term (name, university, or expertise)
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = mentor.name.toLowerCase().includes(searchTermLower);
      const universityMatch = mentor.university.toLowerCase().includes(searchTermLower);
      const expertiseMatch = mentor.expertise?.some(exp => exp.toLowerCase().includes(searchTermLower));
      
      if (!nameMatch && !universityMatch && !expertiseMatch) {
        return false;
      }
    }
    
    return true;
  });

  const handleFilterChange = (value: string, filterName: string) => {
    if (filterName === "expertise") {
      setSelectedExpertise(value);
      // We'll filter the mentors based on if they have this expertise in their array
    }
    
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      university: "",
      company: "",
      expertise: "",
      language: "",
      rating: "",
    });
    setSearchTerm("");
    setSelectedExpertise("");
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Find Your Perfect Mentor
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Connect with experienced professionals and seniors from top universities and companies for personalized guidance
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <div className="relative flex rounded-md shadow-sm">
            <Input
              type="text"
              placeholder="Search by name, university, or expertise..."
              className="rounded-md flex-grow text-base py-6 pr-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchTerm("")}
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="text-gray-500">Active Mentors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <GraduationCap className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold">75+</h3>
            <p className="text-gray-500">Universities</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Briefcase className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold">120+</h3>
            <p className="text-gray-500">Companies</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Star className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold">4.8/5</h3>
            <p className="text-gray-500">Avg. Rating</p>
          </div>
        </div>
        
        {/* Advanced Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">University</label>
              <Select onValueChange={(value) => handleFilterChange(value, "university")}>
                <SelectTrigger id="university" className="mt-1">
                  <SelectValue placeholder="Any University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any University</SelectItem>
                  {POPULAR_UNIVERSITIES.map((university) => (
                    <SelectItem key={university} value={university}>{university}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
              <Select onValueChange={(value) => handleFilterChange(value, "company")}>
                <SelectTrigger id="company" className="mt-1">
                  <SelectValue placeholder="Any Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Company</SelectItem>
                  {POPULAR_COMPANIES.map((company) => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Expertise</label>
              <Select onValueChange={(value) => handleFilterChange(value, "expertise")}>
                <SelectTrigger id="expertise" className="mt-1">
                  <SelectValue placeholder="Any Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Expertise</SelectItem>
                  {EXPERTISE_AREAS.map((expertise) => (
                    <SelectItem key={expertise} value={expertise}>{expertise}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
              <Select onValueChange={(value) => handleFilterChange(value, "language")}>
                <SelectTrigger id="language" className="mt-1">
                  <SelectValue placeholder="Any Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Language</SelectItem>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Min Rating</label>
              <Select onValueChange={(value) => handleFilterChange(value, "rating")}>
                <SelectTrigger id="rating" className="mt-1">
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Rating</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="inline-flex items-center"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </Button>

            <div className="text-sm text-gray-500 flex items-center">
              {mentors && (
                <span>{mentors.length} mentors found</span>
              )}
            </div>
          </div>
        </div>

        {/* Mentor List */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Mentors Available</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : mentors && mentors.length > 0 ? (
            mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-md">
              <div className="mb-4">
                <Search className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No mentors found</h3>
              <p className="text-gray-500 mb-4">No mentors found matching your criteria. Try adjusting your filters.</p>
              <Button onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {mentors && mentors.length > 0 && (
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" className="font-medium">
              Load More Mentors
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
