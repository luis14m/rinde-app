// src/app/rendiciones/DownloadExcelButton.tsx
"use client";
import React from "react";

export default function DownloadExcelButton() {
  const handleDownload = async () => {
    const res = await fetch("/api/export-expenses");
    if (!res.ok) {
      alert("Error al exportar gastos");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  
  return (
    <div className="p-4 flex justify-end gap-2">
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Exportar a Excel
      </button>
      
    </div>
  );
}
