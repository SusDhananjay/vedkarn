import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const mentorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  university: z.string().min(1, "University is required"),
  degree: z.string().min(1, "Degree is required"),
  graduationYear: z.string().regex(/^\d{4}$/, "Please enter a valid year"),
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Job title is required"),
  experience: z.string().min(1, "Years of experience is required"),
  bio: z.string().min(100, "Please write at least 100 characters about yourself"),
  expertiseAreas: z.string().min(1, "Please select at least one area of expertise"),
  languages: z.string().min(1, "Please select at least one language"),
  linkedinProfile: z.string().optional(),
  hearAboutUs: z.string().min(1, "Please let us know how you heard about us"),
});

type MentorFormValues = z.infer<typeof mentorSchema>;

export default function BecomeAMentorPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      university: "",
      degree: "",
      graduationYear: "",
      company: "",
      title: "",
      experience: "",
      bio: "",
      expertiseAreas: "",
      languages: "",
      linkedinProfile: "",
      hearAboutUs: "",
    },
  });

  const mentorApplicationMutation = useMutation({
    mutationFn: async (data: MentorFormValues) => {
      const response = await apiRequest("POST", "/api/mentor/apply", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: "Your application to become a mentor has been submitted successfully!",
      });
      // Move to success step
      setStep(3);
      window.scrollTo(0, 0);
    },
    onError: (error: any) => {
      toast({
        title: "Application failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: MentorFormValues) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setIsSubmitting(true);
    mentorApplicationMutation.mutate(data);
  };

  const handleNextStep = () => {
    const fieldsByStep = {
      1: ["name", "email", "phone", "university", "degree", "graduationYear"],
      2: ["company", "title", "experience", "bio", "expertiseAreas", "languages", "linkedinProfile", "hearAboutUs"],
    };
    
    const currentStepFields = fieldsByStep[step as keyof typeof fieldsByStep];
    const isValid = currentStepFields.every(field => {
      const result = form.trigger(field as keyof MentorFormValues);
      return result;
    });
    
    if (isValid) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Helmet>
        <title>Become a Mentor | MentorConnect</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Become a Mentor</h1>
            <p className="mt-2 text-lg text-gray-600">
              Share your knowledge and experience with students who need your guidance
            </p>
          </div>

          {/* Step Indicator */}
          {step < 3 && (
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center w-full max-w-xs">
                  <div className={`flex-1 h-1 ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} mx-2`}>
                    1
                  </div>
                  <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} mx-2`}>
                    2
                  </div>
                  <div className={`flex-1 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                </div>
              </div>
              <div className="flex items-center justify-center mt-2">
                <div className="flex items-center w-full max-w-xs text-sm">
                  <div className="flex-1 text-center">Personal Info</div>
                  <div className="flex-1 text-center">Professional Info</div>
                </div>
              </div>
            </div>
          )}

          {/* Application Form */}
          <Card>
            <CardContent className="pt-6">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator />
                      
                      <h3 className="text-lg font-medium text-gray-900">Education</h3>
                      
                      <FormField
                        control={form.control}
                        name="university"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>University/College</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your university or college" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="degree"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree/Field of Study</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., B.Tech in Computer Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="graduationYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Graduation Year</FormLabel>
                              <FormControl>
                                <Input placeholder="YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="button" onClick={handleNextStep}>
                          Next: Professional Information
                        </Button>
                      </div>
                    </form>
                  </Form>
                </>
              )}
              
              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Information</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your current company" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your job title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select years of experience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-2">1-2 years</SelectItem>
                                <SelectItem value="3-5">3-5 years</SelectItem>
                                <SelectItem value="6-10">6-10 years</SelectItem>
                                <SelectItem value="10+">More than 10 years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About Yourself</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about yourself, your experience, and how you can help students" 
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              This will be displayed on your profile. Write about your background, expertise, and what students can expect from a session with you.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="expertiseAreas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Areas of Expertise</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your main expertise" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                                  <SelectItem value="Business Management">Business Management</SelectItem>
                                  <SelectItem value="Marketing">Marketing</SelectItem>
                                  <SelectItem value="Finance">Finance</SelectItem>
                                  <SelectItem value="Medicine">Medicine</SelectItem>
                                  <SelectItem value="Law">Law</SelectItem>
                                  <SelectItem value="Design">Design</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                You'll be able to add more specific skills after approval.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="languages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Languages Spoken</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select primary language" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="English">English</SelectItem>
                                  <SelectItem value="Hindi">Hindi</SelectItem>
                                  <SelectItem value="Tamil">Tamil</SelectItem>
                                  <SelectItem value="Telugu">Telugu</SelectItem>
                                  <SelectItem value="Bengali">Bengali</SelectItem>
                                  <SelectItem value="Marathi">Marathi</SelectItem>
                                  <SelectItem value="Gujarati">Gujarati</SelectItem>
                                  <SelectItem value="Kannada">Kannada</SelectItem>
                                  <SelectItem value="Malayalam">Malayalam</SelectItem>
                                  <SelectItem value="Punjabi">Punjabi</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                You'll be able to add more languages after approval.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="linkedinProfile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                            </FormControl>
                            <FormDescription>
                              Providing your LinkedIn profile helps us verify your professional background.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="hearAboutUs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How did you hear about us?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="social_media">Social Media</SelectItem>
                                <SelectItem value="friend">Friend or Colleague</SelectItem>
                                <SelectItem value="search_engine">Search Engine</SelectItem>
                                <SelectItem value="advertisement">Advertisement</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </>
              )}
              
              {step === 3 && (
                <div className="text-center py-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Thank you for applying to become a mentor on MentorConnect. We'll review your application and get back to you within 3-5 business days.
                  </p>
                  <div className="space-y-4 max-w-xs mx-auto">
                    <Button onClick={() => navigate("/")} className="w-full">
                      Back to Home
                    </Button>
                    {user?.userType === "mentor" && (
                      <Button variant="outline" onClick={() => navigate("/mentor/dashboard")} className="w-full">
                        Go to Mentor Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Why Become a Mentor Section */}
          {step < 3 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Why Become a Mentor?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-medium text-gray-900">Earn Extra Income</h3>
                  </div>
                  <p className="text-gray-600">
                    Earn ₹1500 per session while sharing your knowledge and making a positive impact on students' careers.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-medium text-gray-900">Build Your Network</h3>
                  </div>
                  <p className="text-gray-600">
                    Connect with motivated students and expand your professional network across universities and companies.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-medium text-gray-900">Flexible Schedule</h3>
                  </div>
                  <p className="text-gray-600">
                    You control your availability and mentoring hours. Fit mentoring sessions around your existing commitments.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-medium text-gray-900">Make an Impact</h3>
                  </div>
                  <p className="text-gray-600">
                    Share your knowledge and experience to help shape the next generation of professionals in your field.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
