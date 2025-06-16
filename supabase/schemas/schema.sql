create policy "Authenticated users can delete their own records"
on "auth"."users"
as permissive
for delete
to authenticated
using ((auth.uid() = id));


create policy "Authenticated users can insert new records"
on "auth"."users"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can select their own records"
on "auth"."users"
as permissive
for select
to authenticated
using ((auth.uid() = id));


create policy "Authenticated users can update their own records"
on "auth"."users"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check (true);


grant delete on table "storage"."s3_multipart_uploads" to "postgres";

grant insert on table "storage"."s3_multipart_uploads" to "postgres";

grant references on table "storage"."s3_multipart_uploads" to "postgres";

grant select on table "storage"."s3_multipart_uploads" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads" to "postgres";

grant update on table "storage"."s3_multipart_uploads" to "postgres";

grant delete on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant insert on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant references on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant select on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant update on table "storage"."s3_multipart_uploads_parts" to "postgres";

create policy "Allow authenticated uploads"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow public read access"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'expense-documents'::text));


create policy "Allow users to delete their own files"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow users to read their own files"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow users to update their own files"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])))
with check (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Authenticated users can upload files"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'attachments'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Enable delete for authenticated users"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Enable download for authenticated users"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Enable update for authenticated users"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])))
with check (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Enable upload for authenticated users"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));





CREATE OR REPLACE FUNCTION public.set_admin_role(user_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  user_id uuid;
begin
  -- Get the user id from auth.users
  select id into user_id
  from auth.users
  where email = user_email;

  -- Update the role in profiles table
  update public.profiles
  set role = 'admin'
  where id = user_id;
end;
$function$
;

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "display_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "role" "public"."user_role" DEFAULT 'user'::"public"."user_role" NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."ccostos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "codigo" "text" NOT NULL,
    "estado" "public"."estado",
    "fecha_inicio" "date",
    "fecha_termino" "date",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);





CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text",
    "rut" "text",
    "motivo" "text",
    "monto" numeric(15,2),
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
    "eliminado" boolean DEFAULT false
);

CREATE TYPE "public"."estado" AS ENUM (
    'Aprobado',
    'Pendiente',
    'Rechazado'
);

ALTER TABLE expenses
ADD COLUMN estado estado NOT NULL DEFAULT 'Pendiente';

ALTER TABLE expenses
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

ALTER TABLE expenses
ADD COLUMN updated_by TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();





ALTER TABLE ONLY "public"."ccostos"
    ADD CONSTRAINT "ccosto_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "public"."ccostos"
    ADD CONSTRAINT "ccosto_pkey" PRIMARY KEY ("id");





ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."ccostos"
    ADD CONSTRAINT "ccosto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");


ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");


ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


