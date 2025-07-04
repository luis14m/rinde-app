

// Import necessary modules and components
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DataTable } from "@/components/expenses/data-table";
import { columns } from "@/components/expenses/columns";
import { getExpensesByUser } from "@/lib/actions/server.actions";



export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Obtener gastos en el servidor
  const expenses = await getExpensesByUser();

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <div className="container mx-auto">
        <DataTable columns={columns} data={expenses} />
      </div>
    </div>
  );
}