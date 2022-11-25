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
exports.userGroupRoutes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const userGroupRoutes = (app) => {
    app.get("/api/usergroup", getUserGroup);
    app.post("/api/usergroup", createUserGroup);
    app.patch("/api/usergroup/:id", updateUserGroup);
    app.delete("/api/usergroup/:id", deleteUserGroup);
};
exports.userGroupRoutes = userGroupRoutes;
const getUserGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userGroups = yield prisma.userGroup.findMany({
            orderBy: [{ slug: "asc" }],
        });
        res.status(200).send(userGroups);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const createUserGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { FullName, slug } = req.body;
    try {
        const newUserGroup = yield prisma.userGroup.create({
            data: {
                FullName: FullName,
                slug: slug,
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
const updateUserGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { FullName, slug } = req.body;
    const { id } = req.params;
    try {
        const updatedUserGroup = yield prisma.userGroup.update({
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
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const deleteUserGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUserGroup = yield prisma.userGroup.delete({
            where: {
                id: id,
            },
        });
        res
            .status(200)
            .send({ message: "The group has been removed successfully." });
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
