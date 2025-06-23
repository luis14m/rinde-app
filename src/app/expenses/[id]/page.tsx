// Import necessary modules and components
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DataTable } from "@/app/expenses/data-table";
import { columns } from "../columns";
import { getExpenses } from "@/app/expenses/actions";


export default async function RendicionesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  try {
    const expenses = await getExpenses();

    return (
     <div className="flex-1 w-full flex flex-col gap-12 p-8">
        <div className="container mx-auto">
          <DataTable
            data={expenses}
            columns={columns} />

        
        </div>

      </div>
        
    );
    
    
  } catch (error) {
    console.error("Error fetching expenses:", error);

    throw error;
  }
}
