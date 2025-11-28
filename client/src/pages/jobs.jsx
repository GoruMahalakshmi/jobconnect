import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from "@/components/job-card";
import { Search, Briefcase, Loader2, SlidersHorizontal, X } from "lucide-react";

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.employer?.companyName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = jobType === "all" || job.jobType === jobType;
    
    return matchesSearch && matchesType;
  }) || [];

  const clearFilters = () => {
    setSearch("");
    setJobType("all");
  };

  const hasActiveFilters = search || jobType !== "all";

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Job</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Explore opportunities from companies around the world
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs by title, company, or location..."
                className="pl-10 h-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-jobs"
              />
            </div>
            <Button
              variant="outline"
              className="md:hidden gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <div className={`${showFilters ? "flex" : "hidden"} md:flex gap-4`}>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="w-full md:w-[180px] h-12" data-testid="select-job-type">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading ? (
              "Loading jobs..."
            ) : (
              <>
                Showing <span className="font-medium text-foreground">{filteredJobs.length}</span>{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"}
              </>
            )}
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "Check back later for new opportunities"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

