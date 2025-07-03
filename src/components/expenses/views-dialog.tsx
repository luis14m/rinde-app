"use client"

import { useState } from "react"
import { Table } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/utils/supabase/client"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter(
      (column) => typeof column.accessorFn !== "undefined" && column.getCanHide()
    )

  // Estado local para columnas seleccionadas
  const [open, setOpen] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.filter((col) => col.getIsVisible()).map((col) => col.id)
  )
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  // Actualiza columnas seleccionadas localmente
  const handleToggleColumn = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    )
  }

  // Al abrir el dialog, sincroniza el estado local con la tabla
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setSelectedColumns(
        columns.filter((col) => col.getIsVisible()).map((col) => col.id)
      )
      setSaveMsg(null)
    }
  }

  // Guardar selección en la BD
  const handleSave = async () => {
    setSaving(true)
    setSaveMsg(null)
    // Actualiza visibilidad en la tabla
    columns.forEach((col) => {
      col.toggleVisibility(selectedColumns.includes(col.id))
    })
    // Guarda en la BD (ejemplo: tabla 'vista_personalizada')
    try {
      const supabase = await createClient()
      // Puedes obtener el usuario actual aquí si es necesario
        const { data: { user } } = await supabase.auth.getUser()
      // Guarda la vista personalizada (ajusta según tu modelo)
      const { error } = await supabase
        .from("views")
        .upsert([
          {
            
            columns: selectedColumns,
            user_id: user?.id, // Asegúrate de tener el ID del usuario
            // ...otros campos necesarios
          },
        ])
      if (error) throw error
      setSaveMsg("Vista guardada correctamente.")
      setTimeout(() => setOpen(false), 1000)
    } catch (err) {
      setSaveMsg("Error al guardar la vista.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 />
          Columnas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Elegir columnas</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {columns.map((column) => (
            <div key={column.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedColumns.includes(column.id)}
                onCheckedChange={() => handleToggleColumn(column.id)}
                id={`col-${column.id}`}
              />
              <label
                htmlFor={`col-${column.id}`}
                className="capitalize cursor-pointer"
              >
                {column.id}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
          {saveMsg && <span className="text-xs ml-2">{saveMsg}</span>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
