import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const nameList = pgTable("name_lists", {
  id: serial("id").primaryKey(),
  names: text("names").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNameListSchema = createInsertSchema(nameList).pick({
  names: true,
});

export const nameSchema = z.string().trim().min(1, "Name cannot be empty")
  .regex(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, "Name should contain only letters and spaces");

export const bulkNamesSchema = z.array(nameSchema).min(1, "At least one name is required");

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertNameList = z.infer<typeof insertNameListSchema>;
export type NameList = typeof nameList.$inferSelect;
