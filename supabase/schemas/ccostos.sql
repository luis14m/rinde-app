CREATE TABLE IF NOT EXISTS "public"."ccostos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "codigo" "text" NOT NULL,
    "estado" "public"."estado_ccosto" DEFAULT 'Ejecucion'::"public"."estado_ccosto" NOT NULL,
    "fecha_inicio" "date",
    "fecha_termino" "date",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);
