import { redirect } from "next/navigation";
import { getProfileById, updateProfile } from "@/app/profile/actions";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as z from "zod";
import { SubmitButton } from "@/components/submit-button";

// Solo validamos el nombre
const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const profileData = await getProfileById(user.id);

  if (!profileData) {
    return <div>Perfil no encontrado</div>;
  }

  async function updateProfileAction(formData: FormData) {
    "use server";
    const values = {
      name: formData.get("name") as string,
    };
    const result = formSchema.safeParse(values);
    if (!result.success) {
      // Manejo de error si lo necesitas
      return;
    }
    await updateProfile(user.id, values);
    redirect("/");
  }

  return (
    <div className="flex justify-center mt-10">
      <Card className="container max-w-2xl py-8 px-6 relative">
        {profileData.is_admin && (
          <Badge
            variant="secondary"
            className="absolute top-4 right-4 z-10 shadow-md bg-blue-600 text-white"
          >
            Admin
          </Badge>
        )}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Perfil</h1>
          <p className="text-muted-foreground">Actualiza tu perfil.</p>
        </div>
        <form action={updateProfileAction} className="space-y-4 mt-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 w-full max-w-xs">
              <Label htmlFor="name" className="mb-0 w-32 text-left">
                Nombre:
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Nombre Apellido"
                defaultValue={profileData.name || ""}
                className="mb-0 w-full"
                required
              />
            </div>
            <div className="flex items-center gap-2 w-full max-w-xs">
              <Label htmlFor="email" className="mb-0 w-32 text-left">
                Email:
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={profileData.email || ""}
                className="mb-0 w-full"
                readOnly // Cambiado de disabled a readOnly
                required
              />
            </div>
            <SubmitButton
              type="submit"
              variant="outline"
              className="w-full max-w-xs mx-auto block"
            >
              Guardar cambios
            </SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
