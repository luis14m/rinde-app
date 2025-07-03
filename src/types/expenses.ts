export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {

  public: {
    Tables: {
      expenses: {
        Row: {
          abono: number | null
          archivado: boolean
          cod_obra: string | null
          created_at: string | null
          documentos: FileMetadata[] | null
          estado: Database["public"]["Enums"]["estado_rendicion"]
          fecha: string | null
          gasto: number | null
          id: string
          id_rend: number | null
          motivo: string | null
          no_rend: string | null
          nombre_emisor: string | null
          nombre_rendidor: string | null
          numero_documento: string | null
          rut_emisor: string | null
          rut_receptor: string | null
          rut_rendidor: string | null
          tipo_documento: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          abono?: number | null
          archivado?: boolean
          cod_obra?: string | null
          created_at?: string | null
          documentos?: FileMetadata[] | null
          estado?: Database["public"]["Enums"]["estado_rendicion"]
          fecha?: string | null
          gasto?: number | null
          id?: string
          id_rend?: number | null
          motivo?: string | null
          no_rend?: string | null
          nombre_emisor?: string | null
          nombre_rendidor?: string | null
          numero_documento?: string | null
          rut_emisor?: string | null
          rut_receptor?: string | null
          rut_rendidor?: string | null
          tipo_documento?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          abono?: number | null
          archivado?: boolean
          cod_obra?: string | null
          created_at?: string | null
          documentos?: FileMetadata[] | null
          estado?: Database["public"]["Enums"]["estado_rendicion"]
          fecha?: string | null
          gasto?: number | null
          id?: string
          id_rend?: number | null
          motivo?: string | null
          no_rend?: string | null
          nombre_emisor?: string | null
          nombre_rendidor?: string | null
          numero_documento?: string | null
          rut_emisor?: string | null
          rut_receptor?: string | null
          rut_rendidor?: string | null
          tipo_documento?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Enums: {

      estado_rendicion: "Aprobado" | "Pendiente" | "Rechazado"

      tipo_documento:
      | "Boleta"
      | "Factura"
      | "Remuneraciones"
      | "Sin Respaldo"
      | "Transferencia"

      estado_ccosto: "Ejecucion" | "Suspendido" | "Terminado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const TYPES_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
].join(",");

export interface FileMetadata {
  url: string;
  originalName: string;
  size: number;
  type: string;
}

export interface ExpenseCreate {
  nombre_rendidor: string;
  rut_rendidor: string;
  motivo: string;
  gasto: number;
  abono: number;
  nombre_emisor: string;
  rut_emisor: string;
  numero_documento: string;
  tipo_documento: string;
  fecha: string;
  documentos: FileMetadata[];
}

export interface ExpenseFormData {
  nombre_rendidor: string;
  rut_rendidor: string;
  nombre_emisor: string;
  rut_emisor: string;
  motivo: string;
  gasto: number;
  abono: number;

  numero_documento: string;
  tipo_documento: string;
  fecha: string;
  documentos: File[];

}
export const initialExpenseFormData: ExpenseFormData = {
  fecha: '',
  nombre_rendidor: '',
  rut_rendidor: '',
  nombre_emisor: '',
  rut_emisor: '',
  motivo: '',
  numero_documento: '',
  gasto: 0,
  abono: 0,
  tipo_documento: '',
  documentos: [],

};

export const Constants = {

  public: {
    Enums: {
      estado_rendicion: ["Aprobado", "Pendiente", "Rechazado"],
      tipo_documento: [
        "Boleta",
        "Factura",
        "Remuneraciones",
        "Sin Respaldo",
        "Transferencia",
      ],
    },
  },
} as const

export type Expense = Database["public"]["Tables"]["expenses"]["Row"]
export type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"]
export type ExpenseUpdate = Database["public"]["Tables"]["expenses"]["Update"]

export const tipo_documento = Constants.public.Enums.tipo_documento
export const estado_rendicion = Constants.public.Enums.estado_rendicion

