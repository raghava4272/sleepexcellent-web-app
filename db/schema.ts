import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const productCategoryEnum = pgEnum("product_category", ["SOFA", "BED", "MATTRESS", "CEILING"]);
export const publicationStateEnum = pgEnum("publication_state", ["PUBLISHED", "UNPUBLISHED"]);
export const availabilityStateEnum = pgEnum("availability_state", ["IN_STOCK", "OUT_OF_STOCK"]);
export const mediaKindEnum = pgEnum("media_kind", ["IMAGE", "VIDEO"]);
export const checkoutModeEnum = pgEnum("checkout_mode", ["CART", "BUY_NOW"]);
export const orderStatusEnum = pgEnum("order_status", ["NEW", "PROCESSING", "COMPLETED"]);
export const paymentStatusEnum = pgEnum("payment_status", ["PENDING", "PAID", "FAILED"]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    category: productCategoryEnum("category").notNull(),
    name: text("name").notNull(),
    configuration: text("configuration"),
    size: text("size"),
    suitability: text("suitability"),
    fixedPriceMinor: integer("fixed_price_minor"),
    indicativeMinMinor: integer("indicative_min_minor"),
    indicativeMaxMinor: integer("indicative_max_minor"),
    indicativeMaxOpenEnded: boolean("indicative_max_open_ended").notNull().default(false),
    publicationState: publicationStateEnum("publication_state").notNull().default("UNPUBLISHED"),
    availability: availabilityStateEnum("availability"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("products_public_catalogue_idx").on(table.publicationState, table.category),
    check(
      "products_direct_purchase_shape",
      sql`(${table.category} IN ('SOFA', 'BED', 'MATTRESS') AND ${table.fixedPriceMinor} > 0 AND ${table.indicativeMinMinor} IS NULL AND ${table.indicativeMaxMinor} IS NULL AND ${table.suitability} IS NULL) OR (${table.category} = 'CEILING' AND ${table.fixedPriceMinor} IS NULL AND ${table.indicativeMinMinor} > 0 AND ${table.indicativeMaxMinor} >= ${table.indicativeMinMinor} AND ${table.suitability} IS NOT NULL)`,
    ),
  ],
);

export const productMedia = pgTable(
  "product_media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
    kind: mediaKindEnum("kind").notNull(),
    storagePath: text("storage_path").notNull().unique(),
    mimeType: text("mime_type"),
    byteSize: integer("byte_size"),
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text"),
    position: integer("position").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("product_media_product_position_idx").on(table.productId, table.position),
    uniqueIndex("product_media_one_primary_image_idx")
      .on(table.productId)
      .where(sql`${table.isPrimary} = true AND ${table.kind} = 'IMAGE'`),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    publicReference: text("public_reference").notNull().unique(),
    customerUserId: uuid("customer_user_id"),
    checkoutMode: checkoutModeEnum("checkout_mode").notNull(),
    orderStatus: orderStatusEnum("order_status").notNull().default("NEW"),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("PENDING"),
    currency: text("currency").notNull().default("INR"),
    subtotalMinor: integer("subtotal_minor").notNull(),
    shippingMinor: integer("shipping_minor").notNull().default(0),
    totalMinor: integer("total_minor").notNull(),
    customerName: text("customer_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    city: text("city").notNull(),
    state: text("state").notNull(),
    postalCode: text("postal_code").notNull(),
    country: text("country").notNull().default("IN"),
    checkoutIdempotencyKey: uuid("checkout_idempotency_key").notNull().unique(),
    checkoutRequestFingerprint: text("checkout_request_fingerprint").notNull(),
    guestAccessTokenHash: text("guest_access_token_hash"),
    guestAccessExpiresAt: timestamp("guest_access_expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (table) => [
    index("orders_created_at_idx").on(table.createdAt),
    index("orders_customer_created_at_idx").on(table.customerUserId, table.createdAt),
    index("orders_order_status_created_at_idx").on(table.orderStatus, table.createdAt),
    index("orders_payment_status_created_at_idx").on(table.paymentStatus, table.createdAt),
    check("orders_currency_india", sql`${table.currency} = 'INR' AND ${table.country} = 'IN'`),
    check("orders_amount_shape", sql`${table.subtotalMinor} > 0 AND ${table.shippingMinor} >= 0 AND ${table.totalMinor} = ${table.subtotalMinor} + ${table.shippingMinor}`),
    check("orders_postal_code_india", sql`${table.postalCode} ~ '^[1-9][0-9]{5}$'`),
    check("orders_guest_access_shape", sql`(${table.guestAccessTokenHash} IS NULL AND ${table.guestAccessExpiresAt} IS NULL) OR (${table.guestAccessTokenHash} ~ '^[0-9a-f]{64}$' AND ${table.guestAccessExpiresAt} IS NOT NULL)`),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "restrict" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
    productSlug: text("product_slug").notNull(),
    productName: text("product_name").notNull(),
    category: productCategoryEnum("category").notNull(),
    configuration: text("configuration"),
    size: text("size"),
    unitPriceMinor: integer("unit_price_minor").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotalMinor: integer("line_total_minor").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    check("order_items_direct_category", sql`${table.category} IN ('SOFA', 'BED', 'MATTRESS')`),
    check("order_items_amount_shape", sql`${table.unitPriceMinor} > 0 AND ${table.quantity} > 0 AND ${table.lineTotalMinor} = ${table.unitPriceMinor} * ${table.quantity}`),
  ],
);
