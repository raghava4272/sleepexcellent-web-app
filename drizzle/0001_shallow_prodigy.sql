CREATE TYPE "public"."checkout_mode" AS ENUM('CART', 'BUY_NOW');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('NEW', 'PROCESSING', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'PAID', 'FAILED');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"product_slug" text NOT NULL,
	"product_name" text NOT NULL,
	"category" "product_category" NOT NULL,
	"configuration" text,
	"size" text,
	"unit_price_minor" integer NOT NULL,
	"quantity" integer NOT NULL,
	"line_total_minor" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_items_direct_category" CHECK ("order_items"."category" IN ('SOFA', 'BED', 'MATTRESS')),
	CONSTRAINT "order_items_amount_shape" CHECK ("order_items"."unit_price_minor" > 0 AND "order_items"."quantity" > 0 AND "order_items"."line_total_minor" = "order_items"."unit_price_minor" * "order_items"."quantity")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_reference" text NOT NULL,
	"customer_user_id" uuid,
	"checkout_mode" "checkout_mode" NOT NULL,
	"order_status" "order_status" DEFAULT 'NEW' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"subtotal_minor" integer NOT NULL,
	"shipping_minor" integer DEFAULT 0 NOT NULL,
	"total_minor" integer NOT NULL,
	"customer_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text DEFAULT 'IN' NOT NULL,
	"checkout_idempotency_key" uuid NOT NULL,
	"checkout_request_fingerprint" text NOT NULL,
	"guest_access_token_hash" text,
	"guest_access_expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	CONSTRAINT "orders_public_reference_unique" UNIQUE("public_reference"),
	CONSTRAINT "orders_checkout_idempotency_key_unique" UNIQUE("checkout_idempotency_key"),
	CONSTRAINT "orders_currency_india" CHECK ("orders"."currency" = 'INR' AND "orders"."country" = 'IN'),
	CONSTRAINT "orders_amount_shape" CHECK ("orders"."subtotal_minor" > 0 AND "orders"."shipping_minor" >= 0 AND "orders"."total_minor" = "orders"."subtotal_minor" + "orders"."shipping_minor"),
	CONSTRAINT "orders_postal_code_india" CHECK ("orders"."postal_code" ~ '^[1-9][0-9]{5}$'),
	CONSTRAINT "orders_guest_access_shape" CHECK (("orders"."guest_access_token_hash" IS NULL AND "orders"."guest_access_expires_at" IS NULL) OR ("orders"."guest_access_token_hash" ~ '^[0-9a-f]{64}$' AND "orders"."guest_access_expires_at" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_customer_created_at_idx" ON "orders" USING btree ("customer_user_id","created_at");--> statement-breakpoint
CREATE INDEX "orders_order_status_created_at_idx" ON "orders" USING btree ("order_status","created_at");--> statement-breakpoint
CREATE INDEX "orders_payment_status_created_at_idx" ON "orders" USING btree ("payment_status","created_at");--> statement-breakpoint
REVOKE ALL ON TABLE "orders", "order_items" FROM anon, authenticated;--> statement-breakpoint
GRANT SELECT ON TABLE "orders", "order_items" TO authenticated;--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "customers_can_read_own_orders" ON "orders" FOR SELECT TO authenticated USING ("customer_user_id" = (SELECT auth.uid()));--> statement-breakpoint
CREATE POLICY "customers_can_read_own_order_items" ON "order_items" FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM "orders" WHERE "orders"."id" = "order_items"."order_id" AND "orders"."customer_user_id" = (SELECT auth.uid())));
