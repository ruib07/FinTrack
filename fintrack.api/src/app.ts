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

const allowedOrigins = [process.env.WEB_ORIGIN, process.env.EXPO_ORIGIN];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  }),
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

export default app;
