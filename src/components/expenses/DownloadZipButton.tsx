"use client";
import React from "react";

export default function DownloadZipButton() {
  const handleDownloadZip = async () => {
    const res = await fetch("/api/export-expenses");
    if (!res.ok) {
      alert("Error al exportar gastos en ZIP");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 flex justify-end">
      <button
        onClick={handleDownloadZip}
        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        Descargar ZIP
      </button>
    </div>
  );
}
