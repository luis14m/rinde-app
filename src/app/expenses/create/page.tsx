"use client";

import ExpenseForm from '@/components/expenses/ExpenseForm'

export default function CreatePage() {
  
  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <div className="container mx-auto">
        
      
        <h1 className="text-2xl font-bold"></h1>
        
        <ExpenseForm />
      </div>
    </div>
  );
}
