"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { ExpenseEdit } from "@/components/expenses/ExpenseEdit";

import { updateExpense, deleteExpense } from "@/services/supabase/expenseService";
import { Expense, FileMetadata } from "@/types/supabase/expense";

const createColumns = (onDataChange: () => void): ColumnDef<Expense>[] => [
  {
    id: "nombre",
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    id: "rut",
    accessorKey: "rut",
    header: "RUT",
  },
  {
    id: "motivo",
    accessorKey: "motivo",
    header: "Motivo",
  },
  {
    id: "monto",
    accessorKey: "monto",
    header: "Monto",
  },
  {
    id: "abono",
    accessorKey: "abono",
    header: "Abono",
  },
  {
    id: "rut_emisor",
    accessorKey: "rut_emisor",
    header: "RUT Emisor",
  },
  {
    id: "numero_documento",
    accessorKey: "numero_documento",
    header: "N° Documento",
  },
  {
    id: "tipo_documento",
    accessorKey: "tipo_documento",
    header: "Tipo Documento",
  },
  {
    id: "fecha",
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    id: "documentos",
    accessorKey: "documentos",
    header: "Documentos",
    cell: ({ row }) => {
      const documentos = row.getValue("documentos") as FileMetadata[];
      function handleOpen(url: string): void {
        window.open(url, 'noopener,noreferrer');
      }

      return (
        <div className="space-y-4">
          {documentos?.map((doc, index) => (
            <button
              key={index}
              onClick={() => handleOpen(doc.url)}
              className="text-blue-600 hover:text-blue-800 flex items-left"
            >
              <ArrowUpRight className="w-4 h-4 mr-1" />
              {doc.originalName}
            </button>
          ))}
        </div>
      );
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const expense = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

      const handleEdit = (expense: Expense) => {
        setSelectedExpense(expense);
        setIsDialogOpen(true);
      };

      const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedExpense(null);
      };

      const handleDelete = async (id: string) => {
        if (!window.confirm("¿Estás seguro de eliminar?"))
          return;

        try {
          await deleteExpense(id);
          onDataChange(); // Trigger table refresh
        } catch (error) {
          console.error("Error al eliminar el gasto:", error);
          alert("Hubo un error al eliminar el gasto");
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(expense)}>
                <Pencil className="w-4 h-4 mr-2" />
                
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(expense.id)}>
                <Trash2 className="w-4 h-4 mr-2" />
                
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedExpense && (
            <ExpenseEdit
              expense={selectedExpense}
              onClose={handleClose}
              onSave={async (updatedExpense) => {
                try {
                  await updateExpense(updatedExpense.id, updatedExpense);
                  handleClose();
                  onDataChange(); // Replace window.location.reload() with onDataChange
                } catch (error) {
                  console.error("Error al actualizar:", error);
                  alert("Error al actualizar la rendición");
                }
              }}
            />
          )}
        </>
      );
    },
  }
];

export { createColumns };