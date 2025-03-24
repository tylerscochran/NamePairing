import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Defining a Person type with name and URL
export const personSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty")
    .regex(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, "Name should contain only letters and spaces"),
  url: z.string().trim().url("Please enter a valid URL").optional(),
});

export type Person = z.infer<typeof personSchema>;

// Updated nameList to store person objects (name + url)
export const nameList = pgTable("name_lists", {
  id: serial("id").primaryKey(),
  persons: jsonb("persons").notNull().$type<Person[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNameListSchema = createInsertSchema(nameList).pick({
  persons: true,
});

export const bulkPersonsSchema = z.array(personSchema).min(1, "At least one person is required");

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertNameList = z.infer<typeof insertNameListSchema>;
export type NameList = typeof nameList.$inferSelect;
