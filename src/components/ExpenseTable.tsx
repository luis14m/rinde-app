"use client";

import { DataTable } from "@/components/ui/data-table";
import { Expense } from "@/types/supabase/expense";

import { columns } from "@/app/rendiciones/columns";

interface ExpenseTableProps {
  expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const renderSummary = (filteredData: Expense[]) => {
    const totalAmount = filteredData.reduce((sum, item) => sum + (item.monto || 0), 0);
    const totalAbono = filteredData.reduce((sum, item) => sum + (item.abono || 0), 0);
    const balance = totalAbono - totalAmount;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <span className="text-sm font-medium text-gray-500">Total de Gastos</span>
          {/* <p className="text-xl font-bold text-red-600 mt-1">{formatMonto(totalAmount)}</p> */}
        </div>
        {/* ... other summary cards ... */}
      </div>
    );
  };

  return (
    <DataTable
      data={expenses}
      columns={columns}
    />
  );
}