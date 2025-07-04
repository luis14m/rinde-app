
import React from "react";
import {
  getExpenseById
} from "@/lib/actions/server.actions";

import DetailsExpense from "./details-expense";



export default async function DetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = await params;
  const expense = await getExpenseById(id);
  if (!expense) return;

 
    
  // Renderiza el componente cliente con los detalles del gasto
  return <DetailsExpense expense={expense} />;
}
