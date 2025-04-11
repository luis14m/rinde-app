"use client";

import ExpenseForm from "@/components/ExpenseForm";
import Navbar from "@/components/Navbar";

export default function CreatePage() {
  return (
<div className="flex-1 w-full flex flex-col gap-12">
      
     
    <Navbar />
    <ExpenseForm />
    </div>
  );
}