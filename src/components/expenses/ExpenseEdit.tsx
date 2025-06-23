import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Expense , TIPOS_DOCUMENTO } from "@/types/supabase";


interface ExpenseEditProps {
  expense: Expense;
  onClose: () => void; // Función para cerrar el diálogo
  onSave: (updatedExpense: Expense) => Promise<void>;
}

export function ExpenseEdit({ expense, onClose, onSave }: ExpenseEditProps) {
  const [editedExpense, setEditedExpense] = useState<Expense>(expense);

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
      await onSave(editedExpense);
      onClose(); // Cerrar el diálogo después de guardar
    } catch (error) {
      console.error("Error al actualizar el gasto:", error);
      alert("Hubo un error al actualizar el gasto");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Rendición</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                name="nombre"
                value={editedExpense.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>RUT</Label>
              <Input
                name="rut"
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
              <Label>Monto</Label>
              <Input
                name="monto"
                type="number"
                value={editedExpense.monto}
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
              <Label>RUT Emisor</Label>
              <Input
                name="rut_emisor"
                value={editedExpense.rut_emisor}
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
                    tipo_documento: value
                  }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_DOCUMENTO.map((tipo) => (
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
          </div>
          <DialogFooter className="sticky bottom-0 bg-background pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
