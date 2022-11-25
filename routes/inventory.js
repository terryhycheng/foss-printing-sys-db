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
exports.inventoryRoutes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const inventoryRoutes = (app) => {
    app.get("/api/inventory", getInventory);
    app.get("/api/inventory/:type", getInventoryType);
    app.post("/api/inventory", createInventory);
    app.patch("/api/inventory/:id", updateInventory);
};
exports.inventoryRoutes = inventoryRoutes;
const getInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield prisma.inventory.findMany();
        res.status(200).send(info);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const getInventoryType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    try {
        const info = yield prisma.inventory.findMany({
            where: {
                type: type,
            },
        });
        res.status(200).send(info);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const createInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, name, code, quantity } = req.body;
        const newInventory = yield prisma.inventory.create({
            data: {
                type: type,
                name: name,
                code: code,
                quantity: quantity,
            },
        });
        res.status(200).send(newInventory);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const updateInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity } = req.body;
        const { id } = req.params;
        const updatedInventory = yield prisma.inventory.update({
            where: {
                id: id,
            },
            data: {
                quantity: quantity,
            },
        });
        res.status(200).send(updatedInventory);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
