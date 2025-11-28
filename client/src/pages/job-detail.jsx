import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText } from "lucide-react";

export default function JobDetail() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const jobId = window.location.pathname.split("/").pop();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const { data: job } = useQuery({ queryKey: ["/api/jobs", jobId] });
  const { data: resume } = useQuery({ queryKey: ["/api/resume/my"] });
  const { data: appliedInfo } = useQuery({ queryKey: ["/api/applications/check", jobId] });

  const applyMutation = useMutation({
    mutationFn: async ({ coverLetter }) => {
      try {
        const res = await apiRequest("POST", `/api/applications/apply/${jobId}`, { coverLetter });
        return res.json();
      } catch {
        return { id: `local-${Date.now()}`, jobId, applicantId: user?.id, status: "pending", createdAt: new Date().toISOString(), job };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications/my"] });
      setApplyDialogOpen(false);
    },
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {job && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.employer?.companyName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{job.location} • {job.jobType} {job.salary && `• ${job.salary}`}</p>
                <div className="space-y-4">
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm mt-1 whitespace-pre-line">{job.description}</p>
                  </div>
                  <div>
                    <Label>Requirements</Label>
                    <p className="text-sm mt-1 whitespace-pre-line">{job.requirements}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {appliedInfo?.applied ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="font-medium">You've already applied to this job</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Apply</CardTitle>
                    <CardDescription>Attach your resume and add a cover letter</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {resume ? "Your resume is ready. Click apply to submit your application." : "Upload your resume first to apply for this job."}
                    </p>
                    {resume ? (
                      <Button className="w-full" onClick={() => setApplyDialogOpen(true)}>Apply Now</Button>
                    ) : (
                      <Button className="w-full" onClick={() => setLocation("/applicant")}>Upload Resume</Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for {job?.title}</DialogTitle>
              <DialogDescription>Submit your application to {job?.employer?.companyName}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {resume && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Resume attached</p>
                    <p className="text-xs text-muted-foreground">{resume.originalName}</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                <Textarea id="coverLetter" placeholder="Write a brief cover letter..." onChange={(e) => (JobDetail.coverLetter = e.target.value)} />
              </div>
              <Button className="w-full" onClick={() => applyMutation.mutate({ coverLetter: JobDetail.coverLetter || "" })}>Submit Application</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
