CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "is_admin" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

CREATE OR REPLACE VIEW "public"."admins" WITH ("security_invoker"='on') AS
 SELECT "email"
   FROM "public"."profiles"
  WHERE ("is_admin" = true);