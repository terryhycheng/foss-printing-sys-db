import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();

export const printerRoutes = (app: express.Application) => {
  app.get("/api/printer", getInfo);
  app.post("/api/printer", createInfo);
  app.patch("/api/printer/:itemId", updateInfo);
};

type infoBodyType = {
  type: string;
  title: string;
  content: string;
  link?: string;
};

const getInfo = async (req: Request, res: Response) => {
  try {
    const info = await prisma.printer.findMany();
    res.status(200).send(info);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const createInfo = async (req: Request, res: Response) => {
  try {
    const { type, content, link, title }: infoBodyType = req.body;
    const newInfo = await prisma.printer.create({
      data: {
        type: type,
        title: title,
        content: content,
        link: link,
      },
    });
    res.status(200).send(newInfo);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const updateInfo = async (req: Request, res: Response) => {
  try {
    const { content }: infoBodyType = req.body;
    const { itemId } = req.params;
    const updatedInfo = await prisma.printer.update({
      where: {
        id: itemId,
      },
      data: {
        content: content,
      },
    });
    res.status(200).send(updatedInfo);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
