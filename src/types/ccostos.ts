export type Database = {
 
  public: {
    Tables: {
      ccostos: {
        Row: {
          codigo: string
          created_at: string | null
          estado: Database["public"]["Enums"]["estado_ccosto"]
          fecha_inicio: string | null
          fecha_termino: string | null
          id: string
          nombre: string
          user_id: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_ccosto"]
          fecha_inicio?: string | null
          fecha_termino?: string | null
          id?: string
          nombre: string
          user_id?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_ccosto"]
          fecha_inicio?: string | null
          fecha_termino?: string | null
          id?: string
          nombre?: string
          user_id?: string | null
        }
        Relationships: []
      }
       }
    Views: {
      admins: {
        Row: {
          email: string | null
        }
        Insert: {
          email?: string | null
        }
        Update: {
          email?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      set_admin_role: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
    
        estado_ccosto: "Ejecucion" | "Suspendido" | "Terminado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const Constants = {

  public: {
    Enums: {
      estado_ccosto: ["Ejecucion", "Suspendido", "Terminado"],
      
    },
  },
} as const


export type Ccosto = Database["public"]["Tables"]["ccostos"]["Row"]
export type CcostoCreate = Database["public"]["Tables"]["ccostos"]["Insert"] 
export type CcostoUpdate = Database["public"]["Tables"]["ccostos"]["Update"]

export const estado_ccosto = Constants.public.Enums.estado_ccosto

