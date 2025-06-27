'use client';
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
import { uploadDocuments } from "@/app/expenses/actions"; // Asegúrate de importar esto

import { Expense, FileMetadata, tipo_documento, TYPES_MIME } from "@/types/expenses";

interface ExpenseEditProps {
  expense: Expense;
  onClose: () => void; // Función para cerrar el sheet
  onSave: (updatedExpense: Expense) => Promise<void>;
}

export function ExpenseEdit({ expense, onClose, onSave }: ExpenseEditProps) {
  // Estado local: documentos como File[]
  const [editedExpense, setEditedExpense] = useState<Omit<Expense, 'documentos'> & { documentos: File[] }>(
    {
      ...expense,
      documentos: [], // Inicializa como array vacío
    }
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
        documentos: documentosMetadata,
      };
      await onSave(expenseToSave);
      onClose();
    } catch (error) {
      console.error("Error al actualizar el gasto:", error);
      alert("Hubo un error al actualizar el gasto");
    }
  };

  const documentosMetadata: FileMetadata[] = editedExpense.documentos.map((doc: File | FileMetadata) => {
    if ('url' in doc && 'originalName' in doc && 'size' in doc && 'type' in doc) {
      // Ya es FileMetadata
      return doc;
    }
    // Es un File, convertirlo a FileMetadata
    return {
      url: '', // Asigna la URL real después de subir el archivo
      originalName: (doc as File).name,
      size: (doc as File).size,
      type: (doc as File).type,
    };
  });

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right" className="w-full md:w-1/2">
        <SheetHeader>
          <SheetTitle>Editar Rendición</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre Rendidor</Label>
            <Input
              name="nombre"
              value={editedExpense.nombre_rendidor }
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>RUT Rendidor</Label>
            <Input
              name="rut"
              value={editedExpense.rut_emisor}
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
            <Label>Número de Documento</Label>
            <Input
              name="numero_documento"
              value={editedExpense.numero_documento}
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
          <div>
            <Label>Fecha</Label>
            <Input
              name="fecha"
              type="date"
              value={editedExpense.fecha}
              onChange={handleChange}
            />
          </div>
          <div>
            {/* Campo Documentos */}
            <Label>Subir Documentos</Label>
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

          <SheetFooter className="sticky bottom-0 bg-background pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit">Guardar</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
