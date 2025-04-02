import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import knex from "knex";
import knexfile from "../knexfile.js";
import { NODE_ENV } from "./config.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { routes } from "./routes/index.js";

const app = express();
app.use(express.json());

app.db = knex(knexfile[NODE_ENV as keyof typeof knexfile]);

app.use(
  cors({
    origin: process.env.EXPO_ORIGIN,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

routes(app);
errorHandler(app);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const { name, message, stack } = err;
  if (name === "validationError") res.status(400).json({ error: message });
  else res.status(500).json({ name, message, stack });
  next(err);
});

app.listen(3005, () => {
  console.log("Server listening on port 3005");
});

export default app;
