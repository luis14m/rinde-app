

// Import necessary modules and components
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DataTable } from "@/components/expenses/data-table";
import { columns } from "@/components/expenses/columns";

import { getAllStoreExpenses } from "../actions";



export default async function HomePage() {
  const supabase = await createClient();
  

  // Obtener gastos en el servidor
  const expenses = await getAllStoreExpenses();

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <div className="container mx-auto">
        <DataTable columns={columns} data={expenses} />
      </div>
    </div>
  );
}