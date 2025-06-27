CREATE TYPE "public"."estado_rendicion" AS ENUM (
    'Aprobado',
    'Pendiente',
    'Rechazado'
);

CREATE TYPE "public"."tipo_documento" AS ENUM (
  
  'Boleta',
  'Factura',
  'Remuneraciones',
  'Sin Respaldo',
  'Transferencia'
  
);

CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rut_rendidor" "text",
    "motivo" "text",
    "rut_emisor" "text",
    "numero_documento" "text",
    "fecha" "date",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "tipo_documento" "text",
    "user_id" "uuid",
    "documentos" "jsonb",
    "abono" numeric(15,2),
    "gasto" numeric(15,2),
    "cod_obra" "text",
    "no_rend" "text",
    "rut_receptor" "text",
    "id_rend" integer,
    "archivado" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "estado" "public"."estado_rendicion" DEFAULT 'Pendiente'::"public"."estado_rendicion" NOT NULL,
    "nombre_emisor" "text",
    "nombre_rendidor" "text"
);

ALTER TYPE "public"."estado_rendicion" OWNER TO "postgres";

ALTER TYPE "public"."tipo_documento" OWNER TO "postgres";