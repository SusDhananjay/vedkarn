import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Briefcase, 
  GraduationCap, 
  Filter, 
  Star, 
  Users, 
  RefreshCw,
  BookOpen,
  Bell
} from "lucide-react";
import MentorCard from "./MentorCard";
import { Mentor } from "@shared/schema";
import { EXPERTISE_AREAS, LANGUAGES, POPULAR_UNIVERSITIES, POPULAR_COMPANIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function MentorSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    university: "",
    company: "",
    expertise: "",
    language: "",
    rating: "",
  });
  
  // State for expertise selection
  const [selectedExpertise, setSelectedExpertise] = useState("");
  
  // State for refresh notification
  const [newMentorsAvailable, setNewMentorsAvailable] = useState(false);
  
  // Get query client for manual refetching
  const queryClient = useQueryClient();

  // Fetch mentors with real-time polling (10 seconds)
  const { 
    data: allMentors, 
    isLoading, 
    isError, 
    dataUpdatedAt,
    refetch
  } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
    refetchInterval: 10000, // Poll every 10 seconds for new mentors
    staleTime: 5000, // Consider data stale after 5 seconds
  });
  
  // Track last viewed timestamp to detect new mentors
  const [lastViewedTimestamp, setLastViewedTimestamp] = useState(Date.now());
  
  // Check for new mentors when data updates
  useEffect(() => {
    if (dataUpdatedAt > lastViewedTimestamp) {
      setNewMentorsAvailable(true);
    }
  }, [dataUpdatedAt, lastViewedTimestamp]);
  
  // Manual refresh handler
  const handleRefresh = () => {
    refetch();
    setLastViewedTimestamp(Date.now());
    setNewMentorsAvailable(false);
  };
  
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
  
  // Get unique universities and companies from mentor data
  const uniqueUniversities = Array.from(new Set(allMentors?.map(m => m.university) || []));
  const uniqueCompanies = Array.from(new Set(allMentors?.map(m => m.company) || []));
  
  // Add university and company from the real data to the filter options
  const allUniversities = Array.from(new Set([...POPULAR_UNIVERSITIES, ...uniqueUniversities]));
  const allCompanies = Array.from(new Set([...POPULAR_COMPANIES, ...uniqueCompanies]));

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mr-2">
              Find Your Perfect Mentor
            </h1>
            
            {/* New mentors notification */}
            {newMentorsAvailable && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="animate-pulse flex items-center ml-2 border-pink-500 text-pink-700"
                      onClick={handleRefresh}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      New Mentors Available
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to see newly approved mentors</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Connect with experienced professionals and seniors from top universities and companies for personalized guidance
          </p>
          <div className="mt-4 flex justify-center">
            <Badge variant="secondary" className="mr-2 bg-white border-pink-200">
              ₹1500 per session
            </Badge>
            <Badge variant="secondary" className="mr-2 bg-white border-pink-200">
              One-on-one guidance
            </Badge>
            <Badge variant="secondary" className="bg-white border-pink-200">
              Verified mentors
            </Badge>
          </div>
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
            {searchTerm ? (
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
            ) : (
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100 transition-all hover:shadow-md">
            <Users className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold">{allMentors?.length || 0}+</h3>
            <p className="text-gray-500">Active Mentors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100 transition-all hover:shadow-md">
            <GraduationCap className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold">{uniqueUniversities.length || 0}+</h3>
            <p className="text-gray-500">Universities</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100 transition-all hover:shadow-md">
            <Briefcase className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold">{uniqueCompanies.length || 0}+</h3>
            <p className="text-gray-500">Companies</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100 transition-all hover:shadow-md">
            <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold">60 mins</h3>
            <p className="text-gray-500">Session Duration</p>
          </div>
        </div>
        
        {/* Advanced Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10 border border-gray-100">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto"
              onClick={handleRefresh}
            >
              <RefreshCw className={cn(
                "h-4 w-4 mr-1", 
                isLoading ? "animate-spin" : ""
              )} />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">University</label>
              <Select 
                value={filters.university}
                onValueChange={(value) => handleFilterChange(value, "university")}
              >
                <SelectTrigger id="university" className="mt-1">
                  <SelectValue placeholder="Any University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any University</SelectItem>
                  {allUniversities.map((university) => (
                    <SelectItem key={university} value={university}>{university}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
              <Select 
                value={filters.company}
                onValueChange={(value) => handleFilterChange(value, "company")}
              >
                <SelectTrigger id="company" className="mt-1">
                  <SelectValue placeholder="Any Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Company</SelectItem>
                  {allCompanies.map((company) => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Expertise</label>
              <Select 
                value={filters.expertise}
                onValueChange={(value) => handleFilterChange(value, "expertise")}
              >
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
              <Select 
                value={filters.language}
                onValueChange={(value) => handleFilterChange(value, "language")}
              >
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
              <Select 
                value={filters.rating}
                onValueChange={(value) => handleFilterChange(value, "rating")}
              >
                <SelectTrigger id="rating" className="mt-1">
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Rating</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="inline-flex items-center"
              disabled={!Object.values(filters).some(v => v !== "") && !searchTerm}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </Button>

            <div className="text-sm text-gray-600 flex items-center font-medium">
              {mentors && (
                <>
                  <span className="mr-1">Found</span>
                  <span className="text-primary font-bold">{mentors.length}</span>
                  <span className="ml-1">{mentors.length === 1 ? 'mentor' : 'mentors'}</span>
                </>
              )}
            </div>
          </div>
          
          {/* Active filters display */}
          {(Object.values(filters).some(v => v !== "") || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-4 border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")} className="ml-1 h-3 w-3 rounded-full text-gray-500 hover:text-gray-700">
                    ×
                  </button>
                </Badge>
              )}
              
              {filters.university && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200">
                  University: {filters.university}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, university: "" }))} 
                    className="ml-1 h-3 w-3 rounded-full text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {filters.company && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200">
                  Company: {filters.company}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, company: "" }))} 
                    className="ml-1 h-3 w-3 rounded-full text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {filters.expertise && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200">
                  Expertise: {filters.expertise}
                  <button 
                    onClick={() => {
                      setFilters(prev => ({ ...prev, expertise: "" }));
                      setSelectedExpertise("");
                    }} 
                    className="ml-1 h-3 w-3 rounded-full text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {filters.language && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200">
                  Language: {filters.language}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, language: "" }))} 
                    className="ml-1 h-3 w-3 rounded-full text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {filters.rating && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200">
                  Min Rating: {filters.rating}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, rating: "" }))} 
                    className="ml-1 h-3 w-3 rounded-full text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Mentor List */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Mentors Available</h2>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : isError ? (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-md">
              <div className="mb-4 text-red-500">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading mentors</h3>
              <p className="text-gray-500 mb-4">There was an error fetching mentor data. Please try again.</p>
              <Button onClick={handleRefresh}>
                Retry
              </Button>
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

        {mentors && mentors.length > 9 && (
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
