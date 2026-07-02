import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getChecklists = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("checklists")
      .select("*, checklist_items(count)")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

export const createChecklist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ title: z.string().min(1).max(200), description: z.string().max(500).optional() }).parse(data)
  )
  .handler(async ({ context, data }) => {
    const { data: checklist, error } = await context.supabase
      .from("checklists")
      .insert({ title: data.title, description: data.description ?? null, user_id: context.userId })
      .select()
      .single();

    if (error) throw error;
    return checklist;
  });

export const updateChecklist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ id: z.string().uuid(), title: z.string().min(1).max(200).optional(), description: z.string().max(500).optional() }).parse(data)
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("checklists")
      .update({ title: data.title, description: data.description })
      .eq("id", data.id)
      .eq("user_id", context.userId);

    if (error) throw error;
    return { success: true };
  });

export const deleteChecklist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("checklists")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);

    if (error) throw error;
    return { success: true };
  });

export const getChecklistWithItems = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    const { data: checklist, error: checklistError } = await context.supabase
      .from("checklists")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .single();

    if (checklistError) throw checklistError;

    const { data: items, error: itemsError } = await context.supabase
      .from("checklist_items")
      .select("*")
      .eq("checklist_id", data.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (itemsError) throw itemsError;

    return { checklist, items: items ?? [] };
  });

export const createChecklistItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ checklist_id: z.string().uuid(), text: z.string().min(1).max(500) }).parse(data)
  )
  .handler(async ({ context, data }) => {
    const { data: item, error } = await context.supabase
      .from("checklist_items")
      .insert({ checklist_id: data.checklist_id, text: data.text })
      .select()
      .single();

    if (error) throw error;
    return item;
  });

export const updateChecklistItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ id: z.string().uuid(), text: z.string().min(1).max(500).optional(), completed: z.boolean().optional() }).parse(data)
  )
  .handler(async ({ context, data }) => {
    const update: Record<string, unknown> = {};
    if (data.text !== undefined) update.text = data.text;
    if (data.completed !== undefined) update.completed = data.completed;

    const { error } = await context.supabase
      .from("checklist_items")
      .update(update)
      .eq("id", data.id);

    if (error) throw error;
    return { success: true };
  });

export const deleteChecklistItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("checklist_items")
      .delete()
      .eq("id", data.id);

    if (error) throw error;
    return { success: true };
  });
