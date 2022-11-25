import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const prisma = new PrismaClient();
const saltRounds = parseInt(process.env.SALT_ROUND!);
const token_secret = process.env.JWT_SECRET!;

export const authRoutes = (app: express.Application) => {
  app.post("/api/auth", login);
  app.post("/api/register", register);
  app.post("/api/reset", reset);
  app.get("/api/reset/:id", getReset);
  app.patch("/api/reset/:id", setReset);
  app.delete("/api/reset/:id", deleteReset);
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign(
          { id: user.id, email: user.email, password: user.password },
          token_secret
        );
        res.status(200).send(token);
      } else {
        res.status(401).send({ message: "Incorrect email or password." });
      }
    } else {
      res.status(401).send({ message: "Incorrect email or password." });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hash,
      },
    });
    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const reset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      const resetRecord = await prisma.reset.create({
        data: {
          email: user.email,
          userId: user.id,
        },
      });
      let transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: "fossit-print-sys@hotmail.com",
          pass: "FOSSIT1fossit",
        },
      });

      let info = await transporter.sendMail({
        from: "FOSS IT Printing System<fossit-print-sys@hotmail.com>",
        to: email,
        subject: "Reset Password For FOSS Printing System",
        html: `<p>Please check the link below to reset your password.</p><b>http://localhost:3000/reset/${resetRecord.id}</b>`,
      });
      res.status(200).send({ messgae: `Reset email sent to ${user.email}.` });
    } else {
      res.status(400).send({ message: "No account with this email is found." });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const getReset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resetRecord = await prisma.reset.findFirst({
      where: {
        id: id,
      },
    });
    res.status(200).send(resetRecord);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const setReset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    const resetRecord = await prisma.reset.findFirst({
      where: {
        id: id,
      },
    });
    const user = await prisma.user.update({
      where: {
        id: resetRecord?.userId,
      },
      data: {
        password: hash,
      },
    });
    res.status(200).send({ message: "Update password successfully!" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const deleteReset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.reset.delete({
      where: {
        id: id,
      },
    });
    res.status(200).send({ message: "Delete record successfully!" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
