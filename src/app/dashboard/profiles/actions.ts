'use server'
import { createClient } from "@/utils/supabase/server";
import { Profile, ProfileUpdate } from "@/types/profiles";

//Obtiene todos los perfiles
export async function getProfiles(): Promise<Profile[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*");
  if (error) throw error;
  return data;
}