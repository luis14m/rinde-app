"use client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState, useCallback, useMemo, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getExpenses } from '@/app/actions/expense.server';
import { Search, User } from "lucide-react";
import { formatMonto } from '@/utils/formatters';
import { Expense } from '@/types/supabase/expense';
import { toast } from 'sonner';
import { createClient } from "@/utils/supabase/client";
import * as XLSX from 'xlsx';


interface EditableExpense extends Expense {
  isEditing?: boolean;
  editData?: Partial<Expense>;
  newFiles?: File[];
}

interface Filters {
  search: string;
  dateFrom: string;
  dateTo: string;
}

interface DataTableProps<TData> {
  data: TData[]
  columns: (onDataChange: () => void) => ColumnDef<TData, any>[]
  onRefresh?: () => Promise<TData[]>  // Optional refresh handler
}

export function DataTable<TData>({ data, columns }: DataTableProps<TData>) {


  const [tableData, setTableData] = useState<TData[]>(data);
  const [expenses, setExpenses] = useState<EditableExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [user, setUser] = useState<{ email: string } | null>(null);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Error al cargar los gastos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();

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

  const filteredExpenses = expenses.filter(expense => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = !filters.search || 
      expense.nombre.toLowerCase().includes(searchTerm) ||
      expense.rut.toLowerCase().includes(searchTerm) ||
      expense.motivo.toLowerCase().includes(searchTerm) ||
      expense.rut_emisor.toLowerCase().includes(searchTerm);

    const expenseDate = new Date(expense.fecha);
    const matchesDateFrom = !filters.dateFrom || expenseDate >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || expenseDate <= new Date(filters.dateTo);

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

   const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.monto, 0);
  const totalAbono = filteredExpenses.reduce((sum, expense) => sum + (expense.abono || 0), 0);
  const balance = totalAbono - totalAmount;


  const refreshData = useCallback(async () => {
    const newData = await getExpenses();
    setTableData(newData as TData[]);
  }, []);

  const tableColumns = useMemo(
    () => columns(refreshData),
    [refreshData, columns]
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  })
    
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
          <span className="text-sm font-medium text-gray-500">Total de Gastos</span>
          <p className="text-xl font-bold text-red-600 mt-1">{formatMonto(totalAmount)}</p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <span className="text-sm font-medium text-gray-500">Total de Abonos</span>
          <p className="text-xl font-bold text-green-600 mt-1">{formatMonto(totalAbono)}</p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <span className="text-sm font-medium text-gray-500">Balance</span>
          <p className={`text-xl font-bold mt-1 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatMonto(balance)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, RUT, motivo..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
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
                onChange={e => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="date"
                value={filters.dateTo}
                onChange={e => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>


    <div className="rounded-md border">
      <Table id={'Table'}>
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
                )
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                Sin Datos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
     
      </div>
       <div className="p-4 flex justify-end">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Exportar a Excel
        </button>
      </div>
    </div>      
    
  );
}

function exportToExcel() {
    
    const table = document.getElementById('Table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'rendiciones.xlsx');
  }