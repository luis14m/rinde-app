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
  ArrowUpRight,
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
import { ExpenseEdit } from "@/components/expenses/ExpenseEdit";
import { useRouter } from "next/navigation";

import { updateExpense, storeExpense } from "@/app/expenses/actions";
import { Expense, FileMetadata } from "@/types/expenses";
import { formatMonto } from "@/utils/formatters";

export const columns: ColumnDef<Expense>[] = [
  {
    id: "fecha",
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      const fechaRaw = row.getValue("fecha");
      function formatFecha(fecha: string) {
        if (!fecha) return "";
        const d = new Date(fecha);
        if (isNaN(d.getTime())) return fecha;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      }
      return formatFecha(fechaRaw as string);
    },
  },
  {
    id: "nombre_rendidor",
    accessorKey: "nombre_rendidor",
    header: "Nombre",
  },
  {
    id: "rut_rendidor",
    accessorKey: "rut_rendidor",
    header: "RUT Rendidor",
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
    header: "N° Documento",
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
      function handleOpen(url: string): void {
        window.open(url, "noopener,noreferrer");
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
    id: "estado",
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string;
      let icon = null;
      if (estado === "Pendiente") {
        icon = <Clock className="inline w-4 h-4 mr-1 align-middle" />;
      } else if (estado === "Aprobado") {
        icon = <CircleCheckBig className="inline w-4 h-4 mr-1 align-middle" />;
      } else if (estado === "Rechazado") {
        icon = <CircleX className="inline w-4 h-4 mr-1 align-middle" />;
      }
      return (
        <span
          className={`inline-flex items-center gap-1 rounded max-w-max px-2 py-1 ${
            estado === "Pendiente"
              ? "bg-yellow-200 text-yellow-800"
              : estado === "Aprobado"
              ? "bg-green-200 text-green-800"
              : estado === "Rechazado"
              ? "bg-red-200 text-red-800"
              : ""
          }`}
        >
          {icon}
          <span className="truncate">{estado}</span>
        </span>
      );
    },
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleDetail(expense.id)}>
                <Eye className="w-4 h-4 mr-2" />
                Detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(expense.id)}>
                <SquarePen className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleArchivar(expense.id)}>
                <Archive className="w-4 h-4 mr-2" />
                Archivar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {openEdit && editData && (
            <ExpenseEdit
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
