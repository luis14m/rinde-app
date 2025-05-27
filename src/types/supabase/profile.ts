export interface Profile {
    id: string;
    username: string | null;
    display_name: string | null;
    created_at: string;
    updated_at: string;
  }
export interface ProfileUpdate {
    username?: string | null;
    display_name?: string | null;
    updated_at?: string;
  }
