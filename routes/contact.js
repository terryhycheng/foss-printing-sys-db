"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRoutes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const contactRoutes = (app) => {
    app.get("/api/contact", getContact);
    app.post("/api/contact", createContact);
    app.patch("/api/contact/:itemId", updateContact);
};
exports.contactRoutes = contactRoutes;
const getContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield prisma.contact.findMany();
        res.status(200).send(info);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, content, link, title } = req.body;
        const newInfo = yield prisma.contact.create({
            data: {
                type: type,
                title: title,
                content: content,
                link: link,
            },
        });
        res.status(200).send(newInfo);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const updateContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const { itemId } = req.params;
        const updatedInfo = yield prisma.contact.update({
            where: {
                id: itemId,
            },
            data: {
                content: content,
            },
        });
        res.status(200).send(updatedInfo);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
