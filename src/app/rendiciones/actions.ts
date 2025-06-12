// src/app/actions/expense.server.ts
import { createClient } from "@/utils/supabase/server";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import archiver from "archiver";
import { Writable } from "stream";

export async function exportExpensesToExcel() {
  // 1. Conexión a Supabase (usa variables de entorno para las llaves)
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // 2. Obtener datos de la tabla
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  // 3. Obtener columnas dinámicamente
  const columns = expenses.length > 0 ? Object.keys(expenses[0]) : [];

  // 4. Crear archivo Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Expenses");
  worksheet.addRow(columns);
  expenses.forEach((expense) =>
    worksheet.addRow(columns.map((col) => expense[col]))
  );

  // 5. Generar buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // 6. Retornar como respuesta para descarga
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="expenses.xlsx"',
    },
  });
}


// ...existing code...

export async function downloadDocumentsAsZip(publicUrls: string[]): Promise<Buffer | null> {
  const supabase = await createClient();
  const archive = archiver("zip", { zlib: { level: 9 } });
  const buffers: Buffer[] = [];

  // Stream para recolectar los datos del ZIP
  const writable = new Writable({
    write(chunk, _encoding, callback) {
      buffers.push(chunk as Buffer);
      callback();
    }
  });

  archive.pipe(writable);

  for (const publicUrl of publicUrls) {
    try {
      const url = new URL(publicUrl);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.indexOf('expense-documents');
      if (bucketIndex === -1) continue;
      const filePath = pathSegments.slice(bucketIndex + 1).join('/');
      const { data, error } = await supabase.storage.from('expense-documents').download(filePath);
      if (error || !data) continue;
      const originalName = decodeURIComponent(pathSegments[pathSegments.length - 1]);
      const arrayBuffer = await data.arrayBuffer();
      archive.append(Buffer.from(arrayBuffer), { name: originalName });
    } catch (e) {
      continue;
    }
  }

  await archive.finalize();

  // Espera a que el stream termine
  await new Promise<void>((resolve, reject) => {
    writable.on("finish", () => resolve());
    writable.on("error", (err) => reject(err));
    archive.on("error", (err) => reject(err));
  });

  return Buffer.concat(buffers);
}