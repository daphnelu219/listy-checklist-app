import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getChecklistWithItems,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "@/lib/checklists.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { StickerDecorations } from "@/components/StickerDecorations";

export const Route = createFileRoute("/_authenticated/checklists/$id")({
  head: () => ({
    meta: [{ title: "Checklist" }],
  }),
  component: ChecklistDetailPage,
});

function ChecklistDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const fetchDetail = useServerFn(getChecklistWithItems);
  const addItem = useServerFn(createChecklistItem);
  const updateItem = useServerFn(updateChecklistItem);
  const removeItem = useServerFn(deleteChecklistItem);
  const [text, setText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["checklist", id],
    queryFn: () => fetchDetail({ data: { id } }),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["checklist", id] });

  const addMutation = useMutation({
    mutationFn: (t: string) => addItem({ data: { checklist_id: id, text: t } }),
    onSuccess: () => {
      setText("");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleMutation = useMutation({
    mutationFn: (v: { id: string; completed: boolean }) =>
      updateItem({ data: { id: v.id, completed: v.completed } }),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => removeItem({ data: { id: itemId } }),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-muted/20">
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/checklists"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to checklists
        </Link>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !data ? (
          <p className="text-sm text-muted-foreground">Checklist not found.</p>
        ) : (
          <>
            <h1 className="mb-6 text-2xl font-bold">{data.checklist.title}</h1>

            <form
              className="mb-6 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (text.trim()) addMutation.mutate(text.trim());
              }}
            >
              <Input
                placeholder="Add a task..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button type="submit" disabled={addMutation.isPending || !text.trim()}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </form>

            <div className="space-y-2">
              {data.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-md border bg-background px-4 py-3"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleMutation.mutate({ id: item.id, completed: !item.completed })
                    }
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <Checkbox checked={item.completed} className="pointer-events-none" />
                    <span
                      className={`flex-1 text-sm ${
                        item.completed ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                  <Button
                    variant={item.completed ? "secondary" : "default"}
                    size="sm"
                    onClick={() =>
                      toggleMutation.mutate({ id: item.id, completed: !item.completed })
                    }
                  >
                    {item.completed ? (
                      <>
                        <Check className="mr-1 h-4 w-4" /> Done
                      </>
                    ) : (
                      "Finish"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {data.items.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  No tasks yet. Add one above.
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
