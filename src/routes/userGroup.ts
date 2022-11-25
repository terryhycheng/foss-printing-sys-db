import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();

export const userGroupRoutes = (app: express.Application) => {
  app.get("/api/usergroup", getUserGroup);
  app.post("/api/usergroup", createUserGroup);
  app.patch("/api/usergroup/:id", updateUserGroup);
  app.delete("/api/usergroup/:id", deleteUserGroup);
};

const getUserGroup = async (req: Request, res: Response) => {
  try {
    const userGroups = await prisma.userGroup.findMany({
      orderBy: [{ slug: "asc" }],
    });
    res.status(200).send(userGroups);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
const createUserGroup = async (req: Request, res: Response) => {
  const { FullName, slug } = req.body;
  try {
    const newUserGroup = await prisma.userGroup.create({
      data: {
        FullName: FullName,
        slug: slug,
      },
    });
    res
      .status(200)
      .send({ message: "Create successfully!", data: newUserGroup });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const updateUserGroup = async (req: Request, res: Response) => {
  const { FullName, slug } = req.body;
  const { id } = req.params;
  try {
    const updatedUserGroup = await prisma.userGroup.update({
      where: {
        id: id,
      },
      data: {
        FullName: FullName,
        slug: slug,
      },
    });
    res
      .status(200)
      .send({ message: "Update successfully!", data: updatedUserGroup });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const deleteUserGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUserGroup = await prisma.userGroup.delete({
      where: {
        id: id,
      },
    });
    res
      .status(200)
      .send({ message: "The group has been removed successfully." });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
