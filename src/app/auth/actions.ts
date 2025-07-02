'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createProfile } from '@/app/profile/actions'
import { headers } from "next/headers";
import { encodedRedirect } from "@/utils/utils";

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    throw error
  }

  // Revalidar rutas específicas
  revalidatePath('/', 'layout')
  

  redirect('/')

}

export async function signup(formData: FormData) {
  const supabase = await createClient()


  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
   
  })
  
  if (authData.user) {
    try {
      await createProfile(authData.user.id, authData.user.email)
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }
   if (error) throw error
  

  // Revalidar rutas específicas
  revalidatePath('/', 'layout')
  redirect('/profile')


}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/auth/login');
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/profile`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/auth/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }
  // Muestra el alert (opcional)

  return encodedRedirect(
    "success",
    "/auth/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

