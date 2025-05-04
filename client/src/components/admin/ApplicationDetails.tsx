import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X, Briefcase, GraduationCap, Mail, Phone, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ApplicationDetailsProps {
  applicationId: number;
  onActionComplete: () => void;
}

export default function ApplicationDetails({
  applicationId,
  onActionComplete,
}: ApplicationDetailsProps) {
  const [reviewNotes, setReviewNotes] = useState("");
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch application details
  const {
    data: application,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/api/admin/applications", applicationId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/applications/${applicationId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch application details");
      }
      return res.json();
    },
  });

  // Update application status mutation
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      status,
      reviewNotes,
    }: {
      status: string;
      reviewNotes: string;
    }) => {
      return apiRequest("POST", `/api/admin/applications/${applicationId}/update`, {
        status,
        reviewNotes,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications", applicationId] });
      setReviewNotes("");
      onActionComplete();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    updateStatus({ status: "approved", reviewNotes });
    setIsApproveDialogOpen(false);
  };

  const handleReject = () => {
    updateStatus({ status: "rejected", reviewNotes });
    setIsRejectDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !application) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-red-500">Error loading application details</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => onActionComplete()}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusBadgeVariant = 
    application.status === "approved" 
      ? "bg-green-50 text-green-700 border-green-200" 
      : application.status === "rejected"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-yellow-50 text-yellow-700 border-yellow-200";

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{application.name}</CardTitle>
            <CardDescription className="mt-1">
              Application ID: {application.id}
            </CardDescription>
          </div>
          <Badge variant="outline" className={statusBadgeVariant}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{application.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{application.phone}</span>
              </div>
              {application.linkedinProfile && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={application.linkedinProfile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{application.title}</p>
                  <p className="text-sm text-muted-foreground">{application.company}</p>
                  <p className="text-sm text-muted-foreground">{application.experience} years experience</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{application.degree}</p>
                  <p className="text-sm text-muted-foreground">{application.university}</p>
                  <p className="text-sm text-muted-foreground">Graduated: {application.graduationYear}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
            <p className="text-sm whitespace-pre-line">{application.bio}</p>
          </div>

          {/* Expertise & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Expertise Areas</h3>
              <div className="flex flex-wrap gap-2">
                {application.expertiseAreas.split(",").map((area: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {area.trim()}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {application.languages.split(",").map((language: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {language.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">How did they hear about us?</h3>
            <p className="text-sm">{application.hearAboutUs}</p>
          </div>

          {/* Review Notes */}
          {application.status !== "pending" && application.reviewNotes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Review Notes</h3>
              <div className="bg-muted p-3 rounded-md text-sm">
                {application.reviewNotes}
              </div>
            </div>
          )}

          {/* Review Form for Pending Applications */}
          {application.status === "pending" && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Review Notes (Optional)</h3>
              <Textarea
                placeholder="Add notes about this application..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
        </div>
      </CardContent>
      
      {application.status === "pending" && (
        <CardFooter className="flex justify-end gap-3">
          <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject this mentor application? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleReject}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve this mentor application? This will create a mentor profile for this user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}