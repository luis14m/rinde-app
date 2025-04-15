export interface FileMetadata {
  url: string;
  originalName: string;
  size: number;
  type: string;
}

export interface Expense {
  id: string;
  nombre: string;
  rut: string;
  motivo: string;
  monto: number;
  abono: number;
  rut_emisor: string;
  numero_documento: string;
  tipo_documento: string;
  fecha: string;
  documentos: FileMetadata[];
  
  created_at: string;
}


export interface ExpenseCreate {
  nombre: string;
  rut: string;
  motivo: string;
  monto: number;
  abono: number;
  rut_emisor: string;
  numero_documento: string;
  tipo_documento: string;
  fecha: string;
  documentos: FileMetadata[];
}

export interface ExpenseFormData {
  nombre: string;
  rut: string;
  motivo: string;
  monto: number;
  abono:number;
  rut_emisor: string;
  numero_documento: string;
  tipo_documento: string;
  fecha: string;
  documentos: File[];
  
}

export const initialExpenseFormData: ExpenseFormData = {
  nombre: '',
  rut: '',
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


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

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