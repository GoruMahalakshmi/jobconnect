import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function JobCard({ job }) {
  const jobTypeColors = {
    "full-time": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "part-time": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "contract": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "internship": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "remote": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid={`card-job-${job.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {job.employer?.companyName?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate" data-testid={`text-job-title-${job.id}`}>
              {job.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span className="truncate">{job.employer?.companyName || "Company"}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="h-4 w-4 flex-shrink-0 text-primary" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className={jobTypeColors[job.jobType] || ""}>
            {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1).replace("-", " ")}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-muted/30 border-t flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : "Recently"}</span>
        </div>
        <Link href={`/jobs/${job.id}`}>
          <Button size="sm" data-testid={`button-view-job-${job.id}`}>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

