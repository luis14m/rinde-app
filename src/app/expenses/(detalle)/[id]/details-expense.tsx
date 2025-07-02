"use client";
import React, { useEffect, useState } from "react";
import {
  downloadDocument,
  updateExpenseState,
} from "@/app/expenses/actions/client.actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Download,
  Info,
  SquarePen,
  ArrowLeft,
  Files,
  CircleCheckBig,
  Clock,
  CircleX,
} from "lucide-react";
import type { Expense, FileMetadata } from "@/types/expenses";
import type { Profile } from "@/types/profiles";
import Link from "next/link";
import StateLabel from "@/components/expenses/state-badge";
import { getCurrentUserProfile, updateExpense } from "@/app/expenses/actions/server.actions";
import { useRouter } from "next/navigation";
import { EditExpense } from "@/components/expenses/edit-expense";

// Componente cliente para mostrar y descargar documentos

interface DetailsExpenseProps {
  expense: Expense;
  onEdit?: () => void;
}

export default function DetailsExpense({
  expense,
  onEdit,
}: DetailsExpenseProps) {
  // Estado para el perfil
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState<Expense | null>(null);
  const router = useRouter();

  // Obtener perfil del usuario al montar
  useEffect(() => {
    (async () => {
      const p = await getCurrentUserProfile();
      setProfile(p);
    })();
  }, []);

  const isAdmin = profile?.is_admin === true;
  const estado = expense.estado;
  const puedeAprobar = estado === "Pendiente";
  const puedeRevertir =
    isAdmin && (estado === "Aprobado" || estado === "Rechazado");

  const documentos: FileMetadata[] = Array.isArray(expense.documentos)
    ? (expense.documentos as FileMetadata[])
    : [];

  // Acción para cambiar estado
  const handleChangeEstado = async (nuevoEstado: string) => {
    setLoading(true);
    try {
      await updateExpenseState(expense.id, nuevoEstado);
      router.refresh(); //si usas next/navigation
    } catch (e) {
      alert("Error al actualizar el estado");
    } finally {
      setLoading(false);
    }
  };
  // Abrir Shet de edición
  function handleEdit(id: string) {
    setEditData(expense);
    setOpenEdit(true);
  }

  return (
    <>
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-black-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Detalles del Gasto</h1>
        {/* Botones de acción */}
        <div className="flex gap-2 mb-6">
          {puedeAprobar && (
            <>
              <Button
                disabled={loading}
                onClick={() => handleChangeEstado("Aprobado")}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <CircleCheckBig className="inline w-4 h-4 text-green-500 mr-2" />
                Aprobar
              </Button>
              <Button
                disabled={loading}
                onClick={() => handleChangeEstado("Rechazado")}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <CircleX className="inline w-4 h-4 text-red-500 mr-2" />
                Rechazar
              </Button>
            </>
          )}
          {puedeRevertir && (
            <Button
              disabled={loading}
              onClick={() => handleChangeEstado("Pendiente")}
              variant="outline"
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              <Clock className="inline w-4 h-4 text-yellow-500 mr-2" />
              Revertir
            </Button>
          )}
          <Button variant="outline" onClick={() => handleEdit(expense.id)}>
            <SquarePen className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-[2] min-w-[320px]">
          {/* Card de Información del Gasto */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between w-full">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Información del Gasto
              </span>
              <StateLabel estado={expense.estado} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
              <span>${expense.gasto - expense.abono}</span>
              <span className="font-semibold">Fecha:</span>
              <span>{expense.fecha}</span>
              <span className="font-semibold">Tipo de Documento:</span>
              <span>{expense.tipo_documento}</span>
              <span className="font-semibold">Creado:</span>
              <span>{expense.created_at?.split("T")[0]}</span>
              <span className="font-semibold">Actualizado:</span>
              {/* <span>{expense.updated_by || "N/A"}</span> */}
              <span>{expense.updated_at?.split("T")[0]}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[220px]">
          {/* Card de Documentos */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Files className="w-4 h-4" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documentos.length === 0 ? (
              <span>No hay documentos adjuntos.</span>
            ) : (
              <ul className="space-y-4">
                {documentos.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="flex gap-2 bg-gray-100 rounded p-2 items-center w-full">
                      <span className="truncate flex-1">
                        {doc.originalName}
                      </span>

                      <Button
                        // href={doc.url}
                        type="button"
                        variant="outline"
                        title="Abrir"
                        className="w-9 h-9 p-0 text-green-600 hover:text-green-800 flex items-center justify-center"
                        onClick={() =>
                          window.open(doc.url, "_blank", "noopener,noreferrer")
                        }
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        title="Descargar"
                        className="text-blue-600 hover:text-blue-800 flex items-center underline"
                        onClick={async (e) => {
                          e.preventDefault();
                          await downloadDocument(doc.url);
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
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
}
