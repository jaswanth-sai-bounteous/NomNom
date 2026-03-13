import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
  varchar
} from "drizzle-orm/pg-core";

/* ================= USER ================= */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

/* ================= ADDRESS ================= */

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  street: text("street"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  pincode: varchar("pincode", { length: 20 })
});

/* ================= CATEGORY ================= */

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

/* ================= FOOD ITEM ================= */

export const foodItems = pgTable("food_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  foodImg: text("food_img"),
  price: numeric("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

/* ================= FOOD CATEGORY JOIN ================= */

export const foodCategories = pgTable("food_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  foodId: uuid("food_id")
    .references(() => foodItems.id)
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull()
});

/* ================= FEATURED ================= */

export const featured = pgTable("featured", {
  id: uuid("id").defaultRandom().primaryKey(),
  foodId: uuid("food_id")
    .references(() => foodItems.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

/* ================= CART ================= */

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

/* ================= CART ITEM ================= */

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id")
    .references(() => carts.id)
    .notNull(),
  foodItemId: uuid("food_item_id")
    .references(() => foodItems.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: numeric("total_price").notNull()
});

/* ================= ORDER ================= */

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  paymentMethod: varchar("payment_method", { length: 100 }),
  expectedDelivery: timestamp("expected_delivery"),
  shippingAddress: text("shipping_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

/* ================= ORDER ITEM ================= */

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  foodItemId: uuid("food_item_id")
    .references(() => foodItems.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price").notNull(),
  totalPrice: numeric("total_price").notNull()
});

/* ================= PAYMENT ================= */

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  amount: numeric("amount").notNull(),
  paymentMethod: varchar("payment_method", { length: 100 }),
  paymentStatus: varchar("payment_status", { length: 100 }),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  createdAt: timestamp("created_at").defaultNow()
});

/* ================= token  ================= */ 
export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  token: text("token").notNull().unique(),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow()
})