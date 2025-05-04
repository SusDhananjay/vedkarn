import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApplicationDetails from "@/components/admin/ApplicationDetails";

interface Application {
  id: number;
  status: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  university: string;
  degree: string;
  graduationYear: string;
  experience: string;
  bio: string;
  expertiseAreas: string;
  languages: string;
  linkedinProfile?: string;
  hearAboutUs: string;
  reviewNotes?: string;
  reviewedBy?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.userType !== "admin"))) {
      toast({
        title: "Access Denied",
        description: "You need to be an admin to access this page.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, user, setLocation, toast]);

  // Fetch applications
  const {
    data: applications = [],
    isLoading: isLoadingApplications,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["/api/admin/applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/applications");
      if (!res.ok) {
        throw new Error("Failed to fetch applications");
      }
      return res.json();
    },
    enabled: isAuthenticated && user?.userType === "admin",
  });

  // Filter applications by status
  const filteredApplications = applications.filter(
    (application: Application) => application.status === activeTab
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || (user && user.userType !== "admin")) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | MentorConnect</title>
      </Helmet>

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Applications Panel */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Applications</CardTitle>
                <CardDescription>
                  Review and manage mentor applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="pending" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending" className="mt-4">
                    {isLoadingApplications ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : filteredApplications.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No pending applications
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {filteredApplications.map((application: Application) => (
                          <div
                            key={application.id}
                            className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedApplication === application.id
                                ? "border-primary bg-muted/50"
                                : ""
                            }`}
                            onClick={() => setSelectedApplication(application.id)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{application.name}</h3>
                              <Badge>{application.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {application.company} • {application.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="approved" className="mt-4">
                    {isLoadingApplications ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : filteredApplications.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No approved applications
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {filteredApplications.map((application: Application) => (
                          <div
                            key={application.id}
                            className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedApplication === application.id
                                ? "border-primary bg-muted/50"
                                : ""
                            }`}
                            onClick={() => setSelectedApplication(application.id)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{application.name}</h3>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {application.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {application.company} • {application.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="rejected" className="mt-4">
                    {isLoadingApplications ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : filteredApplications.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No rejected applications
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {filteredApplications.map((application: Application) => (
                          <div
                            key={application.id}
                            className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedApplication === application.id
                                ? "border-primary bg-muted/50"
                                : ""
                            }`}
                            onClick={() => setSelectedApplication(application.id)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{application.name}</h3>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                {application.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {application.company} • {application.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Application Details */}
          <div className="md:col-span-2">
            {selectedApplication ? (
              <ApplicationDetails 
                applicationId={selectedApplication}
                onActionComplete={() => {
                  refetchApplications();
                  setSelectedApplication(null);
                }}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    Select an application to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}