"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authRoutes = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const saltRounds = parseInt(process.env.SALT_ROUND);
const token_secret = process.env.JWT_SECRET;
const authRoutes = (app) => {
    app.post("/api/auth", login);
    app.post("/api/register", register);
    app.post("/api/reset", reset);
    app.get("/api/reset/:id", getReset);
    app.patch("/api/reset/:id", setReset);
    app.delete("/api/reset/:id", deleteReset);
};
exports.authRoutes = authRoutes;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (user) {
            const match = yield bcrypt.compare(password, user.password);
            if (match) {
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, password: user.password }, token_secret);
                res.status(200).send(token);
            }
            else {
                res.status(401).send({ message: "Incorrect email or password." });
            }
        }
        else {
            res.status(401).send({ message: "Incorrect email or password." });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const hash = bcrypt.hashSync(password, saltRounds);
        const newUser = yield prisma.user.create({
            data: {
                email: email,
                password: hash,
            },
        });
        res.status(200).send(newUser);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const reset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (user) {
            const resetRecord = yield prisma.reset.create({
                data: {
                    email: user.email,
                    userId: user.id,
                },
            });
            let transporter = nodemailer_1.default.createTransport({
                service: "hotmail",
                auth: {
                    user: "fossit-print-sys@hotmail.com",
                    pass: "FOSSIT1fossit",
                },
            });
            let info = yield transporter.sendMail({
                from: "FOSS IT Printing System<fossit-print-sys@hotmail.com>",
                to: email,
                subject: "Reset Password For FOSS Printing System",
                html: `<p>Please check the link below to reset your password.</p><b>http://localhost:3000/reset/${resetRecord.id}</b>`,
            });
            res.status(200).send({ messgae: `Reset email sent to ${user.email}.` });
        }
        else {
            res.status(400).send({ message: "No account with this email is found." });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const getReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resetRecord = yield prisma.reset.findFirst({
            where: {
                id: id,
            },
        });
        res.status(200).send(resetRecord);
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const setReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const hash = bcrypt.hashSync(password, saltRounds);
        const resetRecord = yield prisma.reset.findFirst({
            where: {
                id: id,
            },
        });
        const user = yield prisma.user.update({
            where: {
                id: resetRecord === null || resetRecord === void 0 ? void 0 : resetRecord.userId,
            },
            data: {
                password: hash,
            },
        });
        res.status(200).send({ message: "Update password successfully!" });
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
const deleteReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.reset.delete({
            where: {
                id: id,
            },
        });
        res.status(200).send({ message: "Delete record successfully!" });
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
});
