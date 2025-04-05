import { NextFunction, Request, Response } from "express";
import jwt from "jwt-simple";
import { User } from "../models/user.model.js";

const secret = process.env.JWT_SECRET;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access Denied: No Token Provided." });
    return;
  }

  try {
    const decoded = jwt.decode(token, secret!) as User;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid Token." });
    return;
  }
};
