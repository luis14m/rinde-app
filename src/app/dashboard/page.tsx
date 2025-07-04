
import { redirect } from "next/navigation";


import { getAllExpenses } from "./expenses/actions";

import { DataTable } from "@/components/expenses/data-table";
import { columns } from "@/components/expenses/columns";

import { getUserAndProfile } from "./actions";

export default async function Dashboard() {
  const { user, profile } = await getUserAndProfile();

  if (!user || !profile) {
    redirect("/auth/login");
  }

  if (!profile.is_admin) {
    redirect("/profile");
  }

  // Obtener gastos en el servidor
  const expenses = await getAllExpenses();

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
          <div className="container mx-auto">
            <DataTable columns={columns} data={expenses} />
          </div>
        </div>
  );
}
