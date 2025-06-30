"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Archive,
  Eye,
  SquarePen,
  Clock,
  CircleCheckBig,
  CircleX,
  Download,
} from "lucide-react";
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
import { EditExpense } from "@/components/expenses/edit-expense";
import { useRouter } from "next/navigation";

import { updateExpense, storeExpense } from "@/app/expenses/actions/server.actions";
import { downloadDocument } from "@/app/expenses/actions/client.actions";
import { Expense, FileMetadata } from "@/types/expenses";
import { formatMonto } from "@/utils/formatters";
import StateLabel from "@/components/expenses/StateLabel";

export const columns: ColumnDef<Expense>[] = [
  {
    id: "fecha",
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      const fechaRaw = row.getValue("fecha");
      // No usar new Date(fecha), solo cortar el string ISO
      function formatFecha(fecha: string) {
        if (!fecha) return "";
        // Espera formato: "YYYY-MM-DD..." (ISO)
        // Tomar solo los primeros 10 caracteres
        const [year, month, day] = fecha.slice(0, 10).split("-");
        return `${day}-${month}-${year}`;
      }
      return formatFecha(fechaRaw as string);
    },
  },
// ...existing code...
  {
    id: "nombre_rendidor",
    accessorKey: "nombre_rendidor",
    header: "Rendidor",
  },
  /* {
    id: "rut_rendidor",
    accessorKey: "rut_rendidor",
    header: "RUT Rendidor",
  }, */
  {
    id: "nombre_emisor",
    accessorKey: "nombre_emisor",
    header: "Nombre Emisor dcto.",
  },
  {
    id: "rut_emisor",
    accessorKey: "rut_emisor",
    header: "RUT Emisor",
  },
  {
    id: "motivo",
    accessorKey: "motivo",
    header: "Motivo",
  },

  {
    id: "numero_documento",
    accessorKey: "numero_documento",
    header: "N° Doc.",
  },

  {
    id: "gasto",
    accessorKey: "gasto",
    header: "Gasto",
    cell: ({ row }) => {
      const gasto = parseFloat(row.getValue("gasto"));
      const formatted = formatMonto(gasto);
      return formatted;
    },
  },
  {
    id: "abono",
    accessorKey: "abono",
    header: "Abono",
    cell: ({ row }) => {
      const abono = parseFloat(row.getValue("abono"));
      const formatted = formatMonto(abono);
      return formatted;
    },
  },

  {
    id: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const abono = Number(row.getValue("abono")) || 0;
      const gasto = Number(row.getValue("gasto")) || 0;
      const balance = abono - gasto;
      const formatted = formatMonto(balance);
      return formatted;
    },
  },
  {
    id: "documentos",
    accessorKey: "documentos",
    header: "Documentos",
    cell: ({ row }) => {
      const documentos = row.getValue("documentos") as FileMetadata[];
      
      return (
        <div className="space-y-4">
          {documentos?.map((doc, index) => (
            <a
              key={index}
              //href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center underline cursor-pointer"
              onClick={async (e) => {
                e.preventDefault();
                await downloadDocument(doc.url);
              }}
            >
              <Download className="w-4 h-4 mr-1" />
              {doc.originalName}
            </a>
          ))}
        </div>
      );
    },
  }, 
  {
    id: "estado",
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string;
      return <StateLabel estado={estado} />;
    }
      
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const expense = row.original;
      const router = useRouter();
      const [openEdit, setOpenEdit] = useState(false);
      const [editData, setEditData] = useState<Expense | null>(null);

      // Ir a detalles
      function handleDetail(id: string) {
        router.push(`/expenses/${id}`);
      }

      // Abrir Shet de edición
      function handleEdit(id: string) {
        setEditData(expense);
        setOpenEdit(true);
      }

      // Archivar gasto
      async function handleArchivar(id: string) {
        await storeExpense(id);
        router.refresh();
      }

      return (
        <>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              title="Detalles"
              onClick={() => handleDetail(expense.id)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              title="Editar"
              onClick={() => handleEdit(expense.id)}
            >
              <SquarePen className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              title="Archivar"
              onClick={() => handleArchivar(expense.id)}
            >
              <Archive className="w-4 h-4" />
            </Button>
          </div>
          {openEdit && editData && (
            <EditExpense
              expense={editData}
              onClose={() => setOpenEdit(false)}
              onSave={async (updated) => {
                await updateExpense(expense.id, updated);
                setOpenEdit(false);
                router.refresh();
              }}
            />
          )}
        </>
      );
    },
  },
];
