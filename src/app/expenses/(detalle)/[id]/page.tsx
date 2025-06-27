import React, { use } from "react";
import { getExpenseById, downloadDocument, updateStateOfExpense, getCurrentUserProfile } from "../../actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download, Info, SquarePen, ArrowLeft } from "lucide-react";
import type { FileMetadata } from "@/types/expenses";
import Link from "next/link";

interface PageProps {
params: Promise<{
id: string;
}>;
}

export default async function DetailsPage(props: PageProps) {
const params = use(props.params);
const expense = await getExpenseById(params.id);
  if (!expense) return;

  // Obtener perfil del usuario
  const profile = await getCurrentUserProfile();
  const isAdmin = profile?.is_admin === true;
  const estado = expense.estado;
  const puedeAprobar = estado === "Pendiente";
  const puedeRevertir = isAdmin && (estado === "Aprobado" || estado === "Rechazado");

  // Asegura que documentos sea un array de FileMetadata
  let documentos: FileMetadata[] = [];
  if (Array.isArray(expense.documentos)) {
    documentos = (expense.documentos as FileMetadata[]);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center text-black-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Detalles del Gasto</h1>
        <Button variant="outline">
          <SquarePen className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Botones de aprobación/rechazo */}
      <div className="flex gap-2 mb-6">
        {puedeAprobar && (
          <form action={async () => { await updateStateOfExpense(expense.id, "Aprobado"); }}>
            <Button type="submit" variant="default">Aprobar</Button>
          </form>
        )}
        {puedeAprobar && (
          <form action={async () => { await updateStateOfExpense(expense.id, "Rechazado"); }}>
            <Button type="submit" variant="destructive">Rechazar</Button>
          </form>
        )}
        {puedeRevertir && (
          <form action={async () => { await updateStateOfExpense(expense.id, "Pendiente"); }}>
            <Button type="submit" variant="outline">Revertir a Pendiente</Button>
          </form>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
      
      <Card className="flex-1 min-w-[320px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            Información del Gasto
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <span className="font-semibold">Estado:</span>
            <span>{expense.estado}</span>
            <span className="font-semibold">Nombre Rendidor:</span>
            <span>{expense.nombre_rendidor}</span>
            <span className="font-semibold">RUT Rendidor:</span>
            <span>{expense.rut_rendidor}</span>
            <span className="font-semibold">Razón Social Emisor:</span>
            <span>{expense.no_rend}</span>
            <span className="font-semibold">RUT Emisor:</span>
            <span>{expense.rut_emisor}</span>
            <span className="font-semibold">Motivo:</span>
            <span>{expense.motivo}</span>
            <span className="font-semibold">N° Documento:</span>
            <span>{expense.numero_documento}</span>
            <span className="font-semibold">Monto:</span>
            <span>${expense.gasto?.toLocaleString()}</span>
            <span className="font-semibold">Abono:</span>
            <span>${expense.abono?.toLocaleString()}</span>
            <span className="font-semibold">Balance:</span>
            <span>${(expense.gasto-expense.abono)}</span>
            <span className="font-semibold">Fecha:</span>
            <span>{expense.fecha}</span>
            <span className="font-semibold">Tipo de Documento:</span>
            <span>{expense.tipo_documento}</span>
            <span className="font-semibold">Creado:</span>
            <span>{expense.created_at?.split("T")[0]}</span>
            <span className="font-semibold">Actualizado:</span>
            <span>{expense.updated_at?.split("T")[0]}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="flex-1 min-w-[320px]">
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <span>No hay documentos adjuntos.</span>
          ) : (
            <ul className="space-y-4">
              {documentos.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="truncate flex-1">{doc.originalName}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Abrir documento"
                    onClick={() => window.open(doc.url, "_blank", "noopener,noreferrer")}
                  >
                    <ArrowUpRight />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Descargar documento"
                    onClick={async () => { await downloadDocument(doc.url); }}
                  >
                    <Download />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
