CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE TYPE "public"."availability_state" AS ENUM('IN_STOCK', 'OUT_OF_STOCK');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('IMAGE', 'VIDEO');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('SOFA', 'BED', 'MATTRESS', 'CEILING');--> statement-breakpoint
CREATE TYPE "public"."publication_state" AS ENUM('PUBLISHED', 'UNPUBLISHED');--> statement-breakpoint
CREATE TABLE "product_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"kind" "media_kind" NOT NULL,
	"storage_path" text NOT NULL,
	"mime_type" text,
	"byte_size" integer,
	"width" integer,
	"height" integer,
	"alt_text" text,
	"position" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_media_storage_path_unique" UNIQUE("storage_path")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"category" "product_category" NOT NULL,
	"name" text NOT NULL,
	"configuration" text,
	"size" text,
	"suitability" text,
	"fixed_price_minor" integer,
	"indicative_min_minor" integer,
	"indicative_max_minor" integer,
	"indicative_max_open_ended" boolean DEFAULT false NOT NULL,
	"publication_state" "publication_state" DEFAULT 'UNPUBLISHED' NOT NULL,
	"availability" "availability_state",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_direct_purchase_shape" CHECK (("products"."category" IN ('SOFA', 'BED', 'MATTRESS') AND "products"."fixed_price_minor" > 0 AND "products"."indicative_min_minor" IS NULL AND "products"."indicative_max_minor" IS NULL AND "products"."suitability" IS NULL) OR ("products"."category" = 'CEILING' AND "products"."fixed_price_minor" IS NULL AND "products"."indicative_min_minor" > 0 AND "products"."indicative_max_minor" >= "products"."indicative_min_minor" AND "products"."suitability" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_media_product_position_idx" ON "product_media" USING btree ("product_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "product_media_one_primary_image_idx" ON "product_media" USING btree ("product_id") WHERE "product_media"."is_primary" = true AND "product_media"."kind" = 'IMAGE';--> statement-breakpoint
CREATE INDEX "products_public_catalogue_idx" ON "products" USING btree ("publication_state","category");--> statement-breakpoint
REVOKE ALL ON TABLE "products", "product_media" FROM anon, authenticated;--> statement-breakpoint
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_media" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "public_can_read_published_products" ON "products" FOR SELECT TO anon, authenticated USING ("publication_state" = 'PUBLISHED');
