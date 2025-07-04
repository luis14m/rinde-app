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

export async function updateProfile(id: string, data:ProfileUpdate): Promise<Profile> {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  if (!profile || !profile.id || !profile.email || !profile.name || !profile.created_at || !profile.updated_at) {
    throw new Error("Profile update failed or returned incomplete data");
  }
  return profile as Profile;
}