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
exports.printerRoutes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const printerRoutes = (app) => {
    app.get("/api/printer", getInfo);
    app.post("/api/printer", createInfo);
    app.patch("/api/printer/:itemId", updateInfo);
};
exports.printerRoutes = printerRoutes;
const getInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield prisma.printer.findMany();
        res.status(200).send(info);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const createInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, content, link, title } = req.body;
        const newInfo = yield prisma.printer.create({
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
const updateInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const { itemId } = req.params;
        const updatedInfo = yield prisma.printer.update({
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
