import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="py-12">
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="gap-2 w-full sm:w-auto" data-testid="link-home">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" className="gap-2 w-full sm:w-auto" data-testid="link-jobs">
                <Search className="h-4 w-4" />
                Browse Jobs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

