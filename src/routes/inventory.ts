import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();

export const inventoryRoutes = (app: express.Application) => {
  app.get("/api/inventory", getInventory);
  app.get("/api/inventory/:type", getInventoryType);
  app.post("/api/inventory", createInventory);
  app.patch("/api/inventory/:id", updateInventory);
};

const getInventory = async (req: Request, res: Response) => {
  try {
    const info = await prisma.inventory.findMany();
    res.status(200).send(info);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const getInventoryType = async (req: Request, res: Response) => {
  const { type } = req.params;
  try {
    const info = await prisma.inventory.findMany({
      where: {
        type: type,
      },
    });
    res.status(200).send(info);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const createInventory = async (req: Request, res: Response) => {
  try {
    const { type, name, code, quantity } = req.body;
    const newInventory = await prisma.inventory.create({
      data: {
        type: type,
        name: name,
        code: code,
        quantity: quantity,
      },
    });
    res.status(200).send(newInventory);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const updateInventory = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;
    const updatedInventory = await prisma.inventory.update({
      where: {
        id: id,
      },
      data: {
        quantity: quantity,
      },
    });
    res.status(200).send(updatedInventory);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
