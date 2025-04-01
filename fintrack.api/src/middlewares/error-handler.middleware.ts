import express, { Request, Response, NextFunction } from "express";
import { InternalServerError } from "../errors/internal-server.error.js";
import { ErrorBase } from "../errors/base.error.js";

export const errorHandler = (app: express.Express) => {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ErrorBase) {
      error.send(res);
    } else {
      new InternalServerError().send(res);
    }
  });
};
