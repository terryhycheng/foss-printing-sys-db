import { PrismaClient } from "@prisma/client";
import moment from "moment";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();

export const printRecordRoutes = (app: express.Application) => {
  app.get("/api/print", getPrintRecord);
  app.post("/api/print", createPrintRecord);
  app.patch("/api/print/:id", updatePrintRecord);
  app.delete("/api/print/:id", deletePrintRecord);
};

const getPrintRecord = async (req: Request, res: Response) => {
  try {
    const userGroups = await prisma.printRecord.findMany({
      orderBy: [{ date: "desc" }],
    });
    res.status(200).send(userGroups);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const createPrintRecord = async (req: Request, res: Response) => {
  const { date, eventName, paperType, quantity, requester, size, userGroupId } =
    req.body;
  try {
    const newUserGroup = await prisma.printRecord.create({
      data: {
        date: moment(date).format(),
        eventName: eventName,
        paperType: paperType,
        quantity: quantity,
        requester: requester,
        size: size,
        userGroupId: userGroupId,
      },
    });
    res
      .status(200)
      .send({ message: "Create successfully!", data: newUserGroup });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const updatePrintRecord = async (req: Request, res: Response) => {
  const { date, eventName, paperType, quantity, requester, size, userGroupId } =
    req.body;
  const { id } = req.params;
  try {
    const updatedUserGroup = await prisma.printRecord.update({
      where: {
        id: id,
      },
      data: {
        date: moment(date).format(),
        eventName: eventName,
        paperType: paperType,
        quantity: quantity,
        requester: requester,
        size: size,
        userGroupId: userGroupId,
      },
    });
    res
      .status(200)
      .send({ message: "Update successfully!", data: updatedUserGroup });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const deletePrintRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedRecord = await prisma.printRecord.delete({
      where: {
        id: id,
      },
    });
    res.status(200).send({ message: "The record has been removed." });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
