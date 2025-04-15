"use client";

import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { FileUploadZone } from "@/components/ui/FileUploadZone";
import {
  ExpenseFormData,
  initialExpenseFormData,
  TIPOS_DOCUMENTO,
  TYPES_MIME,
} from "@/types/supabase/expense";
import {
  createExpense,
  uploadDocuments,
} from "@/services/supabase/expenseService";
import router from "next/router";

// Esquema de validación con Zod
const formSchema = z.object({
  nombre: z.string().min(4, { message: "El nombre es requerido" }),
  rut: z
    .string()
    .min(9, { message: "El RUT es requerido" })
    .max(10, { message: "El RUT no puede tener más de 10 caracteres" }),

  motivo: z.string().min(2, { message: "El motivo es requerido" }),

  monto: z.coerce.number().min(1, { message: "El monto debe ser mayor a 0" }),
  abono: z.coerce
    .number()
    .min(0, { message: "El abono debe ser mayor o igual a 0" }),

  rut_emisor: z.string().min(9, { message: "El RUT del emisor es requerido" }),
  numero_documento: z
    .string()
    .min(1, { message: "El número de documento es requerido" }),
  tipo_documento: z
    .string()
    .min(1, { message: "El tipo de documento es requerido" }),
  fecha: z.string().min(1, { message: "La fecha es requerida" }),
  documentos: z
    .array(z.instanceof(File))
    .min(1, { message: "Debes subir al menos un documento" }),
});

interface ApiResponse {
  success: boolean;
  error?: string;
}

export default function ExpenseForm() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string>("");

  // Inicializar react-hook-form con Zod
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialExpenseFormData,
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Subir documentos a Supabase
      const uploadedDocuments = await uploadDocuments(data.documentos);
      console.log("Documentos subidos:", uploadedDocuments);

      // Crear el objeto de gasto con los documentos subidos
      const expenseData = {
        ...data,
        documentos: uploadedDocuments,
      };

      // Enviar el gasto a la base de datos
      const result: ApiResponse | undefined = await createExpense(expenseData);

      if (result?.success) {
        setMensaje("Gasto guardado con éxito ✅");
        form.reset();
        setTimeout(() => router.push("/rendiciones"), 300);
      } else {
        setMensaje(`Error: ${result?.error || "Error desconocido"}`);
      }
    } catch (error) {
      setMensaje("Error al guardar el gasto");
      console.error("Error al guardar el gasto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black mb-8 text-center">
        Registro de Gastos
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Campo Nombre */}
          <FormField
            control={form.control as Control<ExpenseFormData>}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre Apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo RUT */}
          <FormField
            control={form.control}
            name="rut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUT</FormLabel>
                <FormControl>
                  <Input placeholder="12345678-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Motivo */}
          <FormField
            control={form.control}
            name="motivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descripción del motivo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campos Monto y Abono en la misma línea */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="monto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Monto"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="abono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abono</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Abono"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Campo RUT Emisor */}
          <FormField
            control={form.control}
            name="rut_emisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUT Emisor</FormLabel>
                <FormControl>
                  <Input placeholder="12345678-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Número de Documento */}
          <FormField
            control={form.control}
            name="numero_documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Documento</FormLabel>
                <FormControl>
                  <Input placeholder="Número de Documento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Tipo de Documento */}
          <FormField
            control={form.control}
            name="tipo_documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Fecha */}
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha del Gasto</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Documentos */}
          <FormField
            control={form.control}
            name="documentos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subir Documentos</FormLabel>
                <FormControl>
                  <FileUploadZone
                    files={field.value}
                    onFilesAdd={(files) =>
                      field.onChange([...field.value, ...files])
                    }
                    onFileRemove={(index) => {
                      const newFiles = [...field.value];
                      newFiles.splice(index, 1);
                      field.onChange(newFiles);
                    }}
                    accept={TYPES_MIME}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/rendiciones")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>

          {/* Mensaje de estado */}
          {mensaje && (
            <p className="text-center mt-4 text-red-500">{mensaje}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
