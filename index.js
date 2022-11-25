"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const printer_1 = require("./routes/printer");
const userGroup_1 = require("./routes/userGroup");
const contact_1 = require("./routes/contact");
const inventory_1 = require("./routes/inventory");
const printRecord_1 = require("./routes/printRecord");
const auth_1 = require("./routes/auth");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.status(200).send({ message: "The server is working!" });
});
(0, printer_1.printerRoutes)(app);
(0, userGroup_1.userGroupRoutes)(app);
(0, contact_1.contactRoutes)(app);
(0, inventory_1.inventoryRoutes)(app);
(0, printRecord_1.printRecordRoutes)(app);
(0, auth_1.authRoutes)(app);
app.listen(port, () => console.log(`Server is runing on ${port}`));
module.exports = app;
