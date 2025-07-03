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
import { createExpense } from "@/app/expenses/actions/server.actions";
import { uploadDocuments } from "@/app/expenses/actions/client.actions"; // Asegúrate de importar esto
import { useRouter } from "next/navigation";
import { Files, Info, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
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

export default function FormExpense() {
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

      //toast("Documentos subidos");

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
      

      if (result && result.success) {
        // Verificar que result existe y success es true
        toast("Gasto guardado con éxito ✅");
        form.reset();

        router.push("/");
      } else {
        const errorMessage = result?.error || "Error desconocido";
        console.error("Error en createExpense:", errorMessage); // Añadir este log
        toast("Error en createExpense"); // Añadir este log
        setMensaje(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error completo:", error); // Mejorar el log de error
      toast("Error completo"); // Mejorar el log de error
      setMensaje(
        error instanceof Error ? error.message : "Error al guardar el gasto"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push("/")}>
          Volver a la lista
        </Button>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registro de Gastos</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-[2] min-w-[320px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between w-full">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Información del Gasto
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {/* Campo Nombre Rendidor */}
                  <FormField
                    control={form.control}
                    name="nombre_rendidor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Rendidor <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre Rendidor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo RUT Rendidor */}
                  <FormField
                    control={form.control}
                    name="rut_rendidor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RUT Rendidor <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="12345678-9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Razón Social Emisor */}
                  <FormField
                    control={form.control}
                    name="nombre_emisor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razón Social Emisor <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Razón Social Proveedor" {...field} />
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
                        <FormLabel>RUT Emisor <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="987654321-0" {...field} />
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
                        <FormLabel>Motivo <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Motivo" {...field} />
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
                        <FormLabel>Fecha del Gasto <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Gasto */}
                  <FormField
                    control={form.control}
                    name="gasto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Monto"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Abono */}
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
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
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
                        <FormLabel>Nº Documento <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
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
                        <FormLabel>Tipo de Documento <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[220px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Files className="w-4 h-4" />
                  Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="documentos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subir Documentos <span className="text-red-500">*</span></FormLabel>
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
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2" />
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
          {mensaje && (
            <p className="text-center mt-4 text-red-500">{mensaje}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
