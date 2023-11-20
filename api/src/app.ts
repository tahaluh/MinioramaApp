import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routers";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(router);

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({ message: err.message });
  next();
});

export default app;
