"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteMediaFile(path: string) {
  const supabase = await createClient();
  await supabase.storage.from("media").remove([path]);
  revalidatePath("/admin/media");
}
