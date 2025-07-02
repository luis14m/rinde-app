// Obtener usuario y perfil (para Server Component)
'use server'
import { createClient } from "@/utils/supabase/server";
import { Profile, ProfileUpdate } from "@/types/profiles";  

export async function getUserAndProfile() {
  const supabase = await createClient();
  // Obtener usuario autenticado y validado
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    return { user: null, profile: null };
  }
  let profile = null;
  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (!error && data) {
      profile = data;
    }
  }
  return { user, profile };
}