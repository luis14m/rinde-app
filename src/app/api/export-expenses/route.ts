import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import ExcelJS from "exceljs";
import { downloadDocumentsAsZip } from "@/app/rendiciones/actions";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const columns = expenses.length > 0 ? Object.keys(expenses[0]) : [];


  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Expenses");
  worksheet.addRow(columns);

  
  // 2. Agregar filas transformadas
expenses.forEach(expense => {
  const row = columns.map(col => {
    if (col === "documentos") {
      // Si documentos es un array, extrae solo los URLs y únelos por coma o salto de línea
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

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="expenses.xlsx"',
    },
  });
}



export async function POST(req: NextRequest) {

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ...existing code...
try {
  const { urls } = await req.json() as { urls: string[] };
  console.log("URLs recibidos para ZIP:", urls); // <-- Agrega este log
// ...existing code...

    if (
      !urls ||
      !Array.isArray(urls) ||
      urls.length === 0 ||
      !urls.every(u => typeof u === "string" && u.startsWith("http"))
    ) {
      return NextResponse.json({ error: "No URLs provided or invalid URLs" }, { status: 400 });
    }

    const zipBuffer = await downloadDocumentsAsZip();

    if (!zipBuffer) {
      return NextResponse.json({ error: "No se pudo generar el ZIP" }, { status: 500 });
    }

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="documentos.zip"`,
      },
    });
  } catch (error) {
    console.error("Error en export-expenses:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}