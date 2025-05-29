// Acciones de CLIENTE para profiles
import { createClient } from "@/utils/supabase/client";
import { Profile } from "@/types/supabase/profile";


// Obtener perfil público por ID
export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Agregar después de getProfile()

export async function getProfiles(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) throw error;
  return data || [];
}

export async function getUserAndProfile(): Promise<{
  user: any;
  profile: Profile | null;
}> {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return { user: null, profile: null };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { user, profile };
  } catch (error) {
    console.error('Error fetching user and profile:', error);
    return { user: null, profile: null };
  }
}

// Crear un nuevo perfil
export async function createProfile(userId: string, email: string): Promise<Profile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      username: email,
      display_name: email.split('@')[0],
    
    })
    .select()
    .single();

  if (error) throw error;
  if (!data || !data.id || !data.username || !data.display_name || !data.created_at || !data.updated_at) {
    throw new Error("Profile creation failed or returned incomplete data");
  }
  return data as Profile;
}
