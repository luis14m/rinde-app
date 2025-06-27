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

import { FileUploadZone } from "@/components/ui/file-upload-zone";
import {
  ExpenseCreate,
  initialExpenseFormData,
  tipo_documento,
  TYPES_MIME,
} from "@/types/expenses";
import { createExpense, uploadDocuments } from "@/app/expenses/actions";
import { useRouter } from "next/navigation";

// Esquema de validación con Zod
const formSchema = z.object({
  nombre_rendidor: z.string().min(1, "El nombre rendidor es obligatorio"),
  rut_rendidor: z.string(),
  motivo: z.string(),
  gasto: z.number(),
  abono: z.number(),
  nombre_emisor: z.string().min(1, "El nombre emisor es obligatorio"),
  rut_emisor: z.string(),
  numero_documento: z.string(),
  tipo_documento: z.string().min(1, "El tipo de documento es obligatorio"),
  fecha: z.string(),
  documentos: z.array(z.instanceof(File)),
});

export default function ExpenseForm() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string>("");
  const router = useRouter();

  // Inicializar el form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialExpenseFormData,
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Subir documentos a Supabase
      const uploadedDocuments = await uploadDocuments(data.documentos);
      console.log("Documentos subidos:", uploadedDocuments);

      // Convertir FileMetadata[] a objetos planos
      const plainDocuments = uploadedDocuments.map((doc) => ({
        ...doc,
      }));

      // Crear el objeto de gasto con los documentos subidos
      const expenseData: ExpenseCreate = {
        nombre_rendidor: data.nombre_rendidor!,
        rut_rendidor: data.rut_rendidor!,
        motivo: data.motivo!,
        gasto: data.gasto!,
        abono: data.abono!,
        nombre_emisor: data.rut_emisor!, // Asumiendo que rut_emisor es el nombre del emisor
        rut_emisor: data.rut_emisor!,
        numero_documento: data.numero_documento!,
        tipo_documento: data.tipo_documento!,
        fecha: data.fecha!,
        documentos: plainDocuments, // Usar los objetos planos aquí
      };

      // Crear expense en Supabase
      const result = await createExpense(expenseData);
      console.log("Resultado de createExpense:", result); // Añadir este log

      if (result && result.success) {
        // Verificar que result existe y success es true
        setMensaje("Gasto guardado con éxito ✅");
        form.reset();

        router.push("/rendiciones");
      } else {
        const errorMessage = result?.error || "Error desconocido";
        console.error("Error en createExpense:", errorMessage); // Añadir este log
        setMensaje(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error completo:", error); // Mejorar el log de error
      setMensaje(
        error instanceof Error ? error.message : "Error al guardar el gasto"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black  text-center">
        Registro de Gastos
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Campo Nombre */}
          <FormField
            control={form.control}
            name="nombre_rendidor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Rendidor</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del Rendidor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo RUT */}
          <FormField
            control={form.control}
            name="rut_rendidor"
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

          {/* Campos Gasto y Abono en la misma línea */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gasto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gasto"</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Gasto"
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
          {/* Campo nombre Emisor */}
          <FormField
            control={form.control}
            name="nombre_emisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Emisor</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre o Razon social" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      {tipo_documento.map((tipo) => (
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
            <Button type="button" onClick={() => router.push("/")}>
              Cancelar
            </Button>
            <Button type="submit" variant="outline" disabled={loading}>
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
