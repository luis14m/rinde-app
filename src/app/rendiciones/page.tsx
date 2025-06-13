// Import necessary modules and components
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DataTable } from "@/components/expenses/data-table";
import { Expense } from "@/types/supabase/expense"; // Make sure you have your Expense type defined
import { columns } from "./columns";
import { getExpenses } from "@/app/actions/expense.server";
import DownloadExcelButton from "@/components/expenses/DownloadExcelButton";
import DownloadZipButton from "@/components/expenses/DownloadZipButton";

export default async function RendicionesPage() {
  const supabase = await createClient();
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
          <DataTable<Expense>
            data={expenses}
            columns={columns} />

            <DownloadExcelButton />
        
        </div>

      </div>
        
    );
    
    
  } catch (error) {
    console.error("Error fetching expenses:", error);

    throw error;
  }
}
