import Navbar from "@/components/navbar";
import { createSupabaseClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  /* const customer = await getCustomerByUserId(user.id);

  if (!customer) {
    return redirect("/suscripcion");
  }
 */
  return (

    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <div className="container mx-auto">
        <br />
        <br />
        <br />
        <h1 className="text-2xl font-bold"></h1>
        <Navbar />
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Bienvenido a tu cuenta</h1>

          <div className="w-full mt-6">
            <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
              <InfoIcon size="16" strokeWidth={2} />
              Esta página es accesible solo para usuarios autenticados.
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <ol className="list pl-6 mt-4">
                <li>
                  <strong>ID:</strong> {user.id}
                </li>
                <li>
                  <strong>Email:</strong> {user.email}
                </li>
                <li>
                  <strong>Rol:</strong> {user.role}
                </li>

                <li>
                  <strong>Creado:</strong>{" "}
                  {new Date(user.created_at).toLocaleString()}
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-2xl mb-4"></h2>
          </div>
        </div>
      </div>
    </div>
  );
}
