
export type Database = {
 
  public: {
    Tables: {
    
      
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
    
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileCreate = Database["public"]["Tables"]["profiles"]["Insert"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export type Admins = Database["public"]["Views"]["admins"]["Row"]
export type AdminsInsert = Database["public"]["Views"]["admins"]["Insert"]
export type AdminsUpdate = Database["public"]["Views"]["admins"]["Update"]







