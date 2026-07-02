import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getChecklists,
  createChecklist,
  deleteChecklist,
} from "@/lib/checklists.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Plus, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/checklists/")({
  head: () => ({
    meta: [
      { title: "Your Checklists" },
      { name: "description", content: "Manage all your personal checklists in one place." },
    ],
  }),
  component: ChecklistsPage,
});

function ChecklistsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchChecklists = useServerFn(getChecklists);
  const create = useServerFn(createChecklist);
  const remove = useServerFn(deleteChecklist);
  const [title, setTitle] = useState("");

  const { data: checklists = [], isLoading } = useQuery({
    queryKey: ["checklists"],
    queryFn: () => fetchChecklists(),
  });

  const createMutation = useMutation({
    mutationFn: (t: string) => create({ data: { title: t } }),
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklists"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Checklists</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <form
          className="mb-8 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim()) createMutation.mutate(title.trim());
          }}
        >
          <Input
            placeholder="New checklist title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type="submit" disabled={createMutation.isPending || !title.trim()}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </form>

        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground">Loading...</p>
        ) : checklists.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No checklists yet. Create your first one above.
          </p>
        ) : (
          <div className="grid gap-3">
            {checklists.map((c) => (
              <Card key={c.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
                  <Link
                    to="/checklists/$id"
                    params={{ id: c.id }}
                    className="flex-1"
                  >
                    <CardTitle className="text-base">{c.title}</CardTitle>
                    {c.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                    )}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(c.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
