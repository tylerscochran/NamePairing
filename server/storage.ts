import { users, type User, type InsertUser, type NameList, type InsertNameList, type Person } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Name list operations
  getNameList(id: number): Promise<NameList | undefined>;
  createNameList(nameList: InsertNameList): Promise<NameList>;
  updateNameList(id: number, nameList: InsertNameList): Promise<NameList | undefined>;
  deleteNameList(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private nameLists: Map<number, NameList>;
  currentUserId: number;
  currentNameListId: number;

  constructor() {
    this.users = new Map();
    this.nameLists = new Map();
    this.currentUserId = 1;
    this.currentNameListId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getNameList(id: number): Promise<NameList | undefined> {
    return this.nameLists.get(id);
  }

  async createNameList(insertNameList: InsertNameList): Promise<NameList> {
    const id = this.currentNameListId++;
    const createdAt = new Date();
    const nameList: NameList = { 
      ...insertNameList, 
      id, 
      createdAt 
    };
    this.nameLists.set(id, nameList);
    return nameList;
  }

  async updateNameList(id: number, updateNameList: InsertNameList): Promise<NameList | undefined> {
    const existingNameList = this.nameLists.get(id);
    if (!existingNameList) return undefined;

    const updatedNameList: NameList = {
      ...existingNameList,
      ...updateNameList
    };
    this.nameLists.set(id, updatedNameList);
    return updatedNameList;
  }

  async deleteNameList(id: number): Promise<boolean> {
    return this.nameLists.delete(id);
  }
}

export const storage = new MemStorage();
