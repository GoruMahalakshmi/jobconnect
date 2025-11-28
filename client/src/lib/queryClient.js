import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method, url, data) {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

const fallbackJobs = [
  { id: "sample-1", title: "Frontend Developer", description: "Build UI with React", requirements: "React, TypeScript, CSS", location: "Remote", salary: "$70k-$90k", jobType: "full-time", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
  { id: "sample-2", title: "Backend Developer", description: "Build APIs with Node", requirements: "Node, PostgreSQL", location: "Remote", salary: "$80k-$100k", jobType: "full-time", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
  { id: "sample-3", title: "Data Scientist", description: "Build ML models and analytics", requirements: "Python, Pandas, scikit-learn", location: "Hybrid", salary: "$95k-$130k", jobType: "full-time", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
  { id: "sample-4", title: "DevOps Engineer", description: "Automate deployments and infrastructure", requirements: "Docker, Kubernetes, CI/CD", location: "Remote", salary: "$100k-$140k", jobType: "full-time", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
  { id: "sample-5", title: "Product Manager", description: "Lead product vision and execution", requirements: "Roadmaps, user research, analytics", location: "Onsite", salary: "$110k-$150k", jobType: "full-time", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
  { id: "sample-6", title: "UI/UX Designer", description: "Design intuitive user experiences", requirements: "Figma, prototyping, user testing", location: "Remote", salary: "$70k-$100k", jobType: "contract", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
  { id: "sample-7", title: "QA Engineer", description: "Ensure software quality", requirements: "Testing frameworks, automation", location: "Hybrid", salary: "$60k-$90k", jobType: "part-time", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
  { id: "sample-8", title: "Mobile Developer", description: "Build iOS and Android apps", requirements: "React Native or Flutter", location: "Remote", salary: "$90k-$120k", jobType: "full-time", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
  { id: "sample-9", title: "Full-stack Developer", description: "Build end-to-end features", requirements: "React, Node, SQL", location: "Remote", salary: "$100k-$130k", jobType: "full-time", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
  { id: "sample-10", title: "Cloud Architect", description: "Design scalable cloud solutions", requirements: "AWS, Azure, GCP", location: "Remote", salary: "$130k-$170k", jobType: "full-time", employerId: "sample-employer", isActive: true, createdAt: new Date().toISOString(), employer: { id: "sample-employer", email: "employer@jobconnect.com", password: "", name: "Top Employer", role: "employer", companyName: "Tech Corp", companyDescription: "Leading tech company", isApproved: true, createdAt: new Date().toISOString() } },
];

export const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
  const url = queryKey.join("/");
  try {
    const res = await fetch(url, { credentials: "include" });
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }
    await throwIfResNotOk(res);
    return await res.json();
  } catch {
    if (url === "/api/jobs") return fallbackJobs;
    if (url === "/api/resume/my") {
      const local = typeof window !== "undefined" ? localStorage.getItem("demoResume") : null;
      return local ? JSON.parse(local) : null;
    }
    if (url === "/api/applications/my") return [];
    if (url.startsWith("/api/applications/check/")) return { applied: false };
    if (url === "/api/employer/jobs") return [];
    if (url.startsWith("/api/employer/applications")) return [];
    throw new Error("Network error");
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: { retry: false },
  },
});
