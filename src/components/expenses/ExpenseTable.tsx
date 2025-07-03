"use client";

import { DataTable } from "@/components/expenses/data-table";
import { Expense } from "@/types/expenses";

import { columns } from "@/components/expenses/columns";

interface ExpenseTableProps {
  expenses: Expense[];
  omittedColumns?: string[];

}

export function ExpenseTable({ expenses, omittedColumns }: ExpenseTableProps) {
  
  return (
    <DataTable
      data={expenses}
      columns={columns}
      enableSimplifiedView
      simplifiedColumns={omittedColumns || []}          

    />
  );
}