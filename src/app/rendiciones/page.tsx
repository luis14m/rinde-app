// Import necessary modules and components
import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/server";
import { DataTable } from "@/components/expenses/data-table";
import { Expense } from "@/types/supabase/expense"; // Make sure you have your Expense type defined
import { createColumns } from "./columns";
import { getExpenses } from "@/services/supabase/expenseService";

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
          <br />
          <br />
          <br />
          <h1 className="text-2xl font-bold"></h1>
          
          <DataTable<Expense> data={expenses} columns={createColumns} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching expenses:", error);

    throw error;
  }
}
