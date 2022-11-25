import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();

export const contactRoutes = (app: express.Application) => {
  app.get("/api/contact", getContact);
  app.post("/api/contact", createContact);
  app.patch("/api/contact/:itemId", updateContact);
};

const getContact = async (req: Request, res: Response) => {
  try {
    const info = await prisma.contact.findMany();
    res.status(200).send(info);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const createContact = async (req: Request, res: Response) => {
  try {
    const { type, content, link, title } = req.body;
    const newInfo = await prisma.contact.create({
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

const updateContact = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const { itemId } = req.params;
    const updatedInfo = await prisma.contact.update({
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
