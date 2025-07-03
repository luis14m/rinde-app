export interface View {
  id: string; // uuid
  name: string; // nombre de la vista personalizada
  tabla: string; // nombre de la tabla (ej: "expenses")
  columns: string[]; // columnas seleccionadas
  created_at: string; // ISO date string
  user_id: string; // uuid del usuario
}