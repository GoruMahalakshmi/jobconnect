import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, allowedRoles, requireApproval = false }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const next = user.role === "admin" ? "/admin" : user.role === "employer" ? "/employer" : "/applicant";
    return <Redirect to={next} />;
  }

  if (requireApproval && user.role === "employer" && !user.isApproved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
          <p className="text-muted-foreground">
            Your employer account is awaiting admin approval. You'll be able to post jobs once approved.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
