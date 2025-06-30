"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import { useState, useMemo, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Search, User, Clock, CircleX, Filter, CircleCheckBig } from "lucide-react";
import { formatMonto } from "@/utils/formatters";
import { Expense } from "@/types/expenses";
import { createClient } from "@/utils/supabase/client";

import DownloadExcelButton from "@/components/expenses/DownloadExcelButton";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditableExpense extends Expense {
  isEditing?: boolean;
  editData?: Partial<Expense>;
  newFiles?: File[];
}

interface Filters {
  search: string;
  dateFrom: string;
  dateTo: string;
  estado?: "Pendientes" | "Aprobados" | "Rechazados";
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Expense, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Elimina expenses y fetchExpenses, usa data directamente
  const [filters, setFilters] = useState<Filters>({
    search: "",
    dateFrom: "",
    dateTo: "",

  });
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    // Solo obtener usuario para mostrar email
    const getUser = async () => {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        setUser({ email: data.user.email });
      } else {
        setUser(null);
      }
    };
    getUser();
  }, []);

  // Filtrado sobre data recibida por props
  const filteredExpenses = useMemo(() => {
    return (data as EditableExpense[]).filter((expense) => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        expense.nombre_rendidor.toLowerCase().includes(searchTerm) ||
        expense.rut_rendidor.toLowerCase().includes(searchTerm) ||
        expense.motivo.toLowerCase().includes(searchTerm) ||
        expense.rut_emisor.toLowerCase().includes(searchTerm);
      const expenseDate = new Date(expense.fecha);
      const matchesDateFrom =
        !filters.dateFrom || expenseDate >= new Date(filters.dateFrom);
      const matchesDateTo =
        !filters.dateTo || expenseDate <= new Date(filters.dateTo);
      const matchesEstado =
        !filters.estado ||
        (filters.estado === "Pendientes" && expense.estado === "Pendiente") ||
        (filters.estado === "Aprobados" && expense.estado === "Aprobado") ||
        (filters.estado === "Rechazados" && expense.estado === "Rechazado");
      return matchesSearch && matchesDateFrom && matchesDateTo && matchesEstado;
    });
  }, [data, filters]);

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.gasto,
    0
  );
  const totalAbono = filteredExpenses.reduce(
    (sum, expense) => sum + (expense.abono || 0),
    0
  );
  const balance = totalAbono - totalAmount;

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  // Use filteredExpenses as the data for the table
  const table = useReactTable({
    data: filteredExpenses as TData[],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <div className="space-y-4 max-w-[95vw] mx-auto">
      {/* User Info */}
      <div className="flex items-center justify-end text-sm text-gray-600">
        <User className="w-4 h-4 mr-2" />
        <span>{user?.email}</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <span className="text-sm font-medium text-gray-500">
            Total de Gastos
          </span>
          <p className="text-xl font-bold text-red-600 mt-1">
            {formatMonto(totalAmount)}
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <span className="text-sm font-medium text-gray-500">
            Total de Abonos
          </span>
          <p className="text-xl font-bold text-green-600 mt-1">
            {formatMonto(totalAbono)}
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <span className="text-sm font-medium text-gray-500">Balance</span>
          <p
            className={`text-xl font-bold mt-1 ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatMonto(balance)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por nombre, RUT, motivo..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>


          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DownloadExcelButton
            expenses={filteredExpenses}
            visibleColumns={table.getVisibleLeafColumns().map((col) => col.id)}
          />
          {/* DropdownMenu filtro de estados a la derecha */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {filters.estado ? filters.estado : "Todos los estados"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={!filters.estado}
                onCheckedChange={() => setFilters((prev) => ({ ...prev, estado: undefined }))}
              >
                Todos los estados
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.estado === "Pendientes"}
                onCheckedChange={() => setFilters((prev) => ({ ...prev, estado: "Pendientes" }))}
              >
                <Clock className="inline w-4 h-4 text-yellow-500 mr-2" /> Pendientes
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.estado === "Aprobados"}
                onCheckedChange={() => setFilters((prev) => ({ ...prev, estado: "Aprobados" }))}
              >
                <CircleCheckBig className="inline w-4 h-4 text-green-500 mr-2" /> Aprobados
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.estado === "Rechazados"}
                onCheckedChange={() => setFilters((prev) => ({ ...prev, estado: "Rechazados" }))}
              >
                <CircleX className="inline w-4 h-4 text-red-500 mr-2" /> Rechazados
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div>
        <div className="h-4" />
        <div className="rounded-md border">
          <Table id={"Table"}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="h-24 text-center"
                  >
                    Sin Datos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="h-4" />
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
