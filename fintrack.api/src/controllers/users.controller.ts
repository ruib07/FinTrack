import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { UserService } from "../services/user.service.js";

export class UsersController {
  static async getAll(req: Request, res: Response) {
    res.send(await new UserService().getAll());
  }

  static async getById(req: Request, res: Response) {
    let userId = req.params.id;

    res.send(await new UserService().getById(userId));
  }

  static async update(req: Request, res: Response) {
    let userId = req.params.id;
    let user = req.body as User;

    await new UserService().update(userId, user);

    res.send({
      message: "User updated successfully.",
    });
  }

  static async delete(req: Request, res: Response) {
    let userId = req.params.id;

    await new UserService().delete(userId);

    res.status(204).end();
  }
}
