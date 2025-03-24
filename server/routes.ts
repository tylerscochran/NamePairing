import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nameSchema, bulkNamesSchema, insertNameListSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // API endpoint to save a name list
  app.post("/api/namelists", async (req: Request, res: Response) => {
    try {
      const { names } = req.body;
      
      // Validate the names array
      const validatedNames = bulkNamesSchema.safeParse(names);
      
      if (!validatedNames.success) {
        const error = fromZodError(validatedNames.error);
        return res.status(400).json({ message: error.message });
      }
      
      // Create a new name list
      const nameList = await storage.createNameList({ names: validatedNames.data });
      return res.status(201).json(nameList);
    } catch (error) {
      console.error("Error creating name list:", error);
      return res.status(500).json({ message: "Failed to create name list" });
    }
  });

  // API endpoint to get a name list by ID
  app.get("/api/namelists/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const nameList = await storage.getNameList(id);
      
      if (!nameList) {
        return res.status(404).json({ message: "Name list not found" });
      }
      
      return res.json(nameList);
    } catch (error) {
      console.error("Error fetching name list:", error);
      return res.status(500).json({ message: "Failed to fetch name list" });
    }
  });

  // API endpoint to update a name list
  app.put("/api/namelists/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { names } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Validate the names array
      const validatedNames = bulkNamesSchema.safeParse(names);
      
      if (!validatedNames.success) {
        const error = fromZodError(validatedNames.error);
        return res.status(400).json({ message: error.message });
      }
      
      const updatedNameList = await storage.updateNameList(id, { names: validatedNames.data });
      
      if (!updatedNameList) {
        return res.status(404).json({ message: "Name list not found" });
      }
      
      return res.json(updatedNameList);
    } catch (error) {
      console.error("Error updating name list:", error);
      return res.status(500).json({ message: "Failed to update name list" });
    }
  });

  // API endpoint to delete a name list
  app.delete("/api/namelists/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteNameList(id);
      
      if (!success) {
        return res.status(404).json({ message: "Name list not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting name list:", error);
      return res.status(500).json({ message: "Failed to delete name list" });
    }
  });

  // Validate a single name
  app.post("/api/validate-name", (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      
      const result = nameSchema.safeParse(name);
      
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ 
          valid: false, 
          message: error.message 
        });
      }
      
      return res.json({ 
        valid: true, 
        name: result.data 
      });
    } catch (error) {
      console.error("Error validating name:", error);
      return res.status(500).json({ 
        valid: false, 
        message: "Server error validating name" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
