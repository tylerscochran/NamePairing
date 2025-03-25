import { z } from "zod";
import { validateName } from "./utils";

// Simple Person schema for client-side only app
export const personSchema = z.object({
  name: z.string().min(1, "Name is required").refine(validateName, "Name contains invalid characters"),
  url: z.string().optional(),
});

// Define bulk import schema
export const bulkPersonsSchema = z.array(personSchema).min(1, "At least one person is required");

// Export type for use throughout the app
export type Person = z.infer<typeof personSchema>;