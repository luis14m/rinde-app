"use client";
import React from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import ExcelJS from "exceljs";

interface DownloadExcelButtonProps {
  expenses: any[];
  visibleColumns: string[]; // Nueva prop para columnas visibles
}

export default function DownloadExcelButton({ expenses, visibleColumns }: DownloadExcelButtonProps) {
  const handleDownload = async () => {
    if (!expenses || expenses.length === 0 || !visibleColumns || visibleColumns.length === 0) return;

    const columns = visibleColumns;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");
    worksheet.addRow(columns);

    expenses.forEach(expense => {
      const row = columns.map(col => {
        if (col === "documentos") {
          if (Array.isArray(expense.documentos)) {
            return expense.documentos.map((doc: any) => doc.url).join(", ");
          }
          return "";
        }
        return expense[col];
      });
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Button onClick={handleDownload} variant="outline">
        <Download size={20} />
        Exportar a Excel
      </Button>
    </div>
  );
}
