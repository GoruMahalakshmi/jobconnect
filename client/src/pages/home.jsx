import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Building2, Users, Search, FileText, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { JobCard } from "@/components/job-card";

export default function Home() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const featuredJobs = jobs?.slice(0, 6) || [];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Find Your <span className="text-primary">Dream Job</span> Today
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                  Connect with top employers, discover exciting opportunities, and take the next step in your career journey.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/jobs">
                  <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-find-jobs">
                    <Search className="h-5 w-5" />
                    Find Jobs
                  </Button>
                </Link>
                <Link href="/signup?role=employer">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-post-job">
                    <Building2 className="h-5 w-5" />
                    Post a Job
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">1000+</p>
                  <p className="text-sm text-muted-foreground">Companies</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">5000+</p>
                  <p className="text-sm text-muted-foreground">Job Seekers</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
              <div className="relative bg-card border rounded-2xl p-8 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Senior Developer</p>
                      <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Application Submitted</p>
                      <p className="text-sm text-muted-foreground">Status: Reviewed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Interview Scheduled</p>
                      <p className="text-sm text-muted-foreground">Tomorrow at 10 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps and find your perfect opportunity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                <p className="text-muted-foreground">
                  Sign up as a job seeker or employer to get started with your journey
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse or Post</h3>
                <p className="text-muted-foreground">
                  Search through hundreds of jobs or post your open positions
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Apply or Hire</h3>
                <p className="text-muted-foreground">
                  Submit your application or review candidates and make great hires
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Jobs</h2>
              <p className="text-muted-foreground">Explore the latest opportunities from top companies</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="gap-2" data-testid="link-view-all-jobs">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No jobs available yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to post a job opportunity</p>
                <Link href="/signup?role=employer">
                  <Button>Post a Job</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through JobConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2" data-testid="button-get-started">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">JobConnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your gateway to career opportunities and top talent.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/jobs" className="hover:text-foreground transition-colors">Browse Jobs</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Create Account</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/signup?role=employer" className="hover:text-foreground transition-colors">Post a Job</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Employer Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span></li>
                <li><span className="cursor-pointer hover:text-foreground transition-colors">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>{new Date().getFullYear()} JobConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
