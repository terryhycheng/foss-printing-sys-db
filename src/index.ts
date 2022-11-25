import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { printerRoutes } from "./routes/printer";
import { userGroupRoutes } from "./routes/userGroup";
import { contactRoutes } from "./routes/contact";
import { inventoryRoutes } from "./routes/inventory";
import { printRecordRoutes } from "./routes/printRecord";
import { authRoutes } from "./routes/auth";

const app: express.Application = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response): void => {
  res.status(200).send({ message: "The server is working!" });
});

printerRoutes(app);
userGroupRoutes(app);
contactRoutes(app);
inventoryRoutes(app);
printRecordRoutes(app);
authRoutes(app);

app.listen(port, () => console.log(`Server is runing on ${port}`));

module.exports = app;
