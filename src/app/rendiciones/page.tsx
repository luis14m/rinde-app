import { getExpenses } from "@/services/supabase/expenseService";
import { Expense } from "@/types/supabase/expense";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/server";
import { ExpenseTable } from "@/components/ExpenseTable";

export default async function RendicionesPage() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    const expenses = await getExpenses(user.id);

    return (
       <div className="flex-1 w-full flex flex-col gap-12">
      
        <Navbar />
        <ExpenseTable expenses={expenses} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching expenses:", error);
    
    throw error;
  }
}