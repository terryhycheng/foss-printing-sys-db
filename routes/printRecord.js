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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printRecordRoutes = void 0;
const client_1 = require("@prisma/client");
const moment_1 = __importDefault(require("moment"));
const prisma = new client_1.PrismaClient();
const printRecordRoutes = (app) => {
    app.get("/api/print", getPrintRecord);
    app.post("/api/print", createPrintRecord);
    app.patch("/api/print/:id", updatePrintRecord);
    app.delete("/api/print/:id", deletePrintRecord);
};
exports.printRecordRoutes = printRecordRoutes;
const getPrintRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userGroups = yield prisma.printRecord.findMany({
            orderBy: [{ date: "desc" }],
        });
        res.status(200).send(userGroups);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const createPrintRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, eventName, paperType, quantity, requester, size, userGroupId } = req.body;
    try {
        const newUserGroup = yield prisma.printRecord.create({
            data: {
                date: (0, moment_1.default)(date).format(),
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
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const updatePrintRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, eventName, paperType, quantity, requester, size, userGroupId } = req.body;
    const { id } = req.params;
    try {
        const updatedUserGroup = yield prisma.printRecord.update({
            where: {
                id: id,
            },
            data: {
                date: (0, moment_1.default)(date).format(),
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
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const deletePrintRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedRecord = yield prisma.printRecord.delete({
            where: {
                id: id,
            },
        });
        res.status(200).send({ message: "The record has been removed." });
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
