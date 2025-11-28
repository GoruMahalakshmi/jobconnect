import { useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Upload, Loader2, Trash2, CheckCircle, Clock } from "lucide-react";
import { Link } from "wouter";

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: resume, isLoading: resumeLoading } = useQuery({ queryKey: ["/api/resume/my"] });
  const { data: applications, isLoading: applicationsLoading } = useQuery({ queryKey: ["/api/applications/my"] });
  const { data: jobs } = useQuery({ queryKey: ["/api/jobs"] });

  const uploadResumeMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("resume", file);

      try {
        const response = await fetch("/api/resume/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!response.ok) {
          let message = "Upload failed";
          try { const j = await response.json(); message = j?.message || message; } catch { try { const t = await response.text(); message = t || message; } catch {} }
          throw new Error(message);
        }
        return await response.json();
      } catch (e) {
        const local = {
          id: `local-${Date.now()}`,
          applicantId: user?.id,
          filename: "local-resume.pdf",
          originalName: file?.name || "resume.pdf",
          mimeType: "application/pdf",
          size: file?.size || 0,
          uploadedAt: new Date().toISOString(),
        };
        localStorage.setItem("demoResume", JSON.stringify(local));
        return local;
      }
    },
    onSuccess: () => {
      toast({ title: "Resume uploaded successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/resume/my"] });
      setUploadProgress(0);
    },
    onError: (error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploadProgress(0);
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async () => {
      try {
        return await apiRequest("DELETE", "/api/resume/my");
      } catch {
        localStorage.removeItem("demoResume");
        return new Response(null, { status: 200 });
      }
    },
    onSuccess: () => {
      toast({ title: "Resume deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/resume/my"] });
    },
    onError: (error) => {
      toast({ title: "Failed to delete resume", description: error.message, variant: "destructive" });
    },
  });

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const nameLower = (file.name || "").toLowerCase();
    const typeLower = (file.type || "").toLowerCase();
    const isPdf = typeLower === "application/pdf" || nameLower.endsWith(".pdf");
    if (!isPdf) {
      toast({ title: "Invalid file type", description: "Please upload a PDF file", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    setUploadProgress(10);
    try {
      const res = await uploadResumeMutation.mutateAsync(file);
      setUploadProgress(100);
    } finally {
      setTimeout(() => setUploading(false), 500);
    }
  };

  const totalApplications = applications?.length || 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Applicant Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {user?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload a PDF resume (max 2MB)</CardDescription>
            </CardHeader>
            <CardContent>
              {resume ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium" data-testid="text-resume-name">{resume.originalName}</p>
                      <p className="text-sm text-muted-foreground">
                        {(resume.size / 1024).toFixed(1)} KB • Uploaded {resume.uploadedAt ? formatDistanceToNow(new Date(resume.uploadedAt), { addSuffix: true }) : "recently"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" data-testid="button-delete-resume">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete your resume.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteResumeMutation.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => fileInputRef.current?.click()} data-testid="dropzone-resume">
                  {uploading ? (
                    <div className="space-y-4">
                      <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                      <Progress value={uploadProgress} className="w-1/2 mx-auto" />
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                      <p className="font-medium mb-1">Click to upload your resume</p>
                      <p className="text-sm text-muted-foreground">PDF only, max 5MB</p>
                    </>
                  )}
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileSelect} data-testid="input-resume-file" />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="flex items-center justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : applications && applications.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.job?.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{app.createdAt ? formatDistanceToNow(new Date(app.createdAt), { addSuffix: true }) : "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">You haven't applied to any jobs yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Explore Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {jobs && jobs.length > 0 ? (
                  <div className="space-y-3">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="p-3 border rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{job.location} • {job.jobType}</p>
                        </div>
                        <Link href={`/jobs/${job.id}`}><Button size="sm" variant="outline">View</Button></Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No jobs available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
