"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FileUploadZone } from "@/components/ui/file-upload-zone";
import { uploadDocuments } from "@/lib/actions/client.actions"; // Asegúrate de importar esto

import {
  Expense,
  FileMetadata,
  tipo_documento,
  TYPES_MIME,
} from "@/types/expenses";
import { Files, FileText, Save, X } from "lucide-react";
import { toast } from "sonner";

interface ExpenseEditProps {
  expense: Expense;
  onClose: () => void; // Función para cerrar el sheet
  //onFileRemove: (index: number) => void;
  onSave: (updatedExpense: Expense) => Promise<void>;
}

export function EditExpense({ expense, onClose, onSave }: ExpenseEditProps) {
  // Estado local: documentos como File[]
  const [editedExpense, setEditedExpense] = useState<
    Omit<Expense, "documentos"> & { documentos: File[] }
  >({
    ...expense,
    documentos: [], // Inicializa como array vacío
  });

  const [savedDocs, setSavedDocs] = useState<FileMetadata[]>(
    expense.documentos || []
  );

  // Si expense.documentos existe y es FileMetadata[], conviértelo a File[] al montar
  useEffect(() => {
    if (expense.documentos && Array.isArray(expense.documentos)) {
      // No se puede convertir FileMetadata a File directamente, pero puedes crear un File simulado si es necesario
      // Aquí solo se deja vacío para evitar errores
      setEditedExpense((prev) => ({ ...prev, documentos: [] }));
    }
  }, [expense.documentos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Sube los archivos y obtén los metadatos completos
      let documentosMetadata: FileMetadata[] = [];
      if (editedExpense.documentos.length > 0) {
        documentosMetadata = await uploadDocuments(editedExpense.documentos);
      }

      // 2. Prepara el gasto a guardar

      const expenseToSave: Expense = {
        ...editedExpense,
        documentos: [
          ...savedDocs,
          ...(await uploadDocuments(editedExpense.documentos)),
        ],
      };

      await onSave(expenseToSave);
      toast.success("Gasto actualizado exitosamente");
      onClose();
    } catch (error) {
      toast.error("Hubo un error al actualizar el gasto");
    }
  };

  const documentosMetadata: FileMetadata[] = editedExpense.documentos.map(
    (doc: File | FileMetadata) => {
      if (
        "url" in doc &&
        "originalName" in doc &&
        "size" in doc &&
        "type" in doc
      ) {
        // Ya es FileMetadata
        return doc;
      }
      // Es un File, convertirlo a FileMetadata
      return {
        url: "", // Asigna la URL real después de subir el archivo
        originalName: (doc as File).name,
        size: (doc as File).size,
        type: (doc as File).type,
      };
    }
  );

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="px-6 sm:max-w-xl max-w-2xl overflow-y-auto" // max-w-2xl = ancho máximo, overflow-y-auto = scroll vertical
        //style={{ maxHeight: '100vh' }} // Asegura que el scroll funcione en toda la altura de la ventana
      >
        <SheetHeader>
          <SheetTitle>Editar Rendición</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          //style={{ maxHeight: 'calc(100vh - 120px)' }} // Ajusta según el header/footer
        >
          <div>
            <Label>Fecha</Label>
            <Input
              name="fecha"
              type="date"
              value={
                editedExpense.fecha
                  ? new Date(editedExpense.fecha).toISOString().slice(0, 10)
                  : ""
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Nombre Rendidor</Label>
            <Input
              name="nombre_rendidor"
              value={editedExpense.nombre_rendidor}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Nombre Emisor</Label>
            <Input
              name="nombre_emisor"
              value={editedExpense.nombre_emisor}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>RUT Emisor</Label>
            <Input
              name="rut_emisor"
              value={editedExpense.rut_emisor}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Motivo</Label>
            <Input
              name="motivo"
              value={editedExpense.motivo}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Número de Documento</Label>
            <Input
              name="numero_documento"
              value={editedExpense.numero_documento}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Gasto</Label>
            <Input
              name="gasto"
              type="number"
              value={editedExpense.gasto}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Abono</Label>
            <Input
              name="abono"
              type="number"
              value={editedExpense.abono}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Tipo de Documento</Label>
            <Select
              value={editedExpense.tipo_documento}
              onValueChange={(value) =>
                setEditedExpense((prev) => ({
                  ...prev,
                  tipo_documento: value,
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                {tipo_documento.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Documentos */}
          <div>
            <div className="flex items-center mb-2">
              <Files className="mr-2" />
              <Label className="mb-0">Subir Documentos</Label>
            </div>
            <FileUploadZone
              files={editedExpense.documentos}
              onFilesAdd={(files) =>
                setEditedExpense((prev) => ({
                  ...prev,
                  documentos: [...(prev.documentos || []), ...files],
                }))
              }
              onFileRemove={(index) => {
                setEditedExpense((prev) => {
                  const newFiles = [...(prev.documentos || [])];
                  newFiles.splice(index, 1);
                  return { ...prev, documentos: newFiles };
                });
              }}
              accept={TYPES_MIME}
            />
          </div>

          {/* Documentos guardados */}
          {savedDocs && savedDocs.length > 0 && (
            <div className="mb-2">
              <Label className="mb-1 block">Documentos guardados:</Label>
              {expense.documentos.map((doc, idx) => (
                <div
                  key={doc.url || doc.originalName + idx}
                  className="flex items-center bg-muted rounded px-3 py-2 mb-1"
                >
                  <FileText className="mr-2 text-muted-foreground" />
                  <span className="flex-1 truncate text-muted-foreground">
                    {doc.originalName && <>{doc.originalName}</>}
                  </span>
                  <button
                    type="button"
                    className="ml-2 text-destructive hover:underline"
                    onClick={() => {
                      setSavedDocs((prev) => {
                        const newFiles = [...prev];
                        newFiles.splice(idx, 1);
                        return newFiles;
                      });
                    }}
                    aria-label="Eliminar documento"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <SheetFooter className="flex flex-row justify-end gap-4 mb-8">
            <SheetClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit">
              <Save />
              Guardar
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
