import { getExpenses } from "@/services/supabase/expenseService";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/server";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function RendicionesPage() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    const expenses = await getExpenses();

    return (
      <div className="flex-1 w-full flex flex-col gap-12 p-8">
        <div className="container mx-auto">
          <DataTable data={expenses} columns={columns} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching expenses:", error);

    throw error;
  }
}
