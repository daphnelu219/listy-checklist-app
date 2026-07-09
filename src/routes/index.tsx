// Home route
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex items-center gap-2">
        <CheckSquare className="h-10 w-10 text-primary" />
        <span className="text-3xl font-bold tracking-tight">Checklists</span>
      </div>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Stay organized, one checklist at a time
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Create, track, and complete your personal checklists. Simple, fast, and
        always in sync.
      </p>
      <div className="mt-8">
        <Button asChild size="lg">
          <Link to="/checklists">Get started</Link>
        </Button>
      </div>
    </div>
  );
}
