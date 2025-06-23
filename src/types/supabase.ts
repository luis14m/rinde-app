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
      ccostos: {
        Row: {
          codigo: string
          created_at: string | null
          fecha_inicio: string | null
          fecha_termino: string | null
          id: string
          nombre: string
          user_id: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          fecha_inicio?: string | null
          fecha_termino?: string | null
          id?: string
          nombre: string
          user_id?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          fecha_inicio?: string | null
          fecha_termino?: string | null
          id?: string
          nombre?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          abono: number | null
          archivado: boolean
          balance: number | null
          cod_obra: string | null
          created_at: string | null
          documentos: Json | null
          estado: Database["public"]["Enums"]["estado_rendicion"]
          fecha: string | null
          gasto: number | null
          id: string
          id_rend: number | null
          monto: number | null
          motivo: string | null
          no_rend: string | null
          nombre: string | null
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
          balance?: number | null
          cod_obra?: string | null
          created_at?: string | null
          documentos?: Json | null
          estado?: Database["public"]["Enums"]["estado_rendicion"]
          fecha?: string | null
          gasto?: number | null
          id?: string
          id_rend?: number | null
          monto?: number | null
          motivo?: string | null
          no_rend?: string | null
          nombre?: string | null
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
          balance?: number | null
          cod_obra?: string | null
          created_at?: string | null
          documentos?: Json | null
          estado?: Database["public"]["Enums"]["estado_rendicion"]
          fecha?: string | null
          gasto?: number | null
          id?: string
          id_rend?: number | null
          monto?: number | null
          motivo?: string | null
          no_rend?: string | null
          nombre?: string | null
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
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_admin?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_admin_role: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      estado_rendicion: "Aprobado" | "Pendiente" | "Rechazado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_rendicion: ["Aprobado", "Pendiente", "Rechazado"],
    },
  },
} as const

export interface FileMetadata {
  url: string;
  originalName: string;
  size: number;
  type: string;
}
export interface ExpenseFormData {
  nombre: string;
  rut_rendidor?: string;
  motivo?: string;
  monto: number;
  abono?:number;
  rut_emisor?: string;
  numero_documento?: string;
  tipo_documento: string;
  fecha?: string;
  documentos: File[];
  
}

export const initialExpenseFormData: ExpenseFormData = {
  nombre: '',
  rut_rendidor: '',
  motivo: '',
  monto: 0,
  abono: 0,
  rut_emisor: '',
  numero_documento: '',
  tipo_documento: '',
  fecha: '',
  documentos: [],
};

export const TIPOS_DOCUMENTO = [
  
  'Boleta',
  'Factura',
  'Remuneraciones',
  'Sin Respaldo',
  'Transferencia',
  
] as const;


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

export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type ExpenseCreate = Database["public"]["Tables"]["expenses"]["Insert"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type CCosto = Database["public"]["Tables"]["ccostos"]["Row"];
export type CCostoInsert = Database["public"]["Tables"]["ccostos"]["Insert"];
export type CCostoUpdate = Database["public"]["Tables"]["ccostos"]["Update"];
