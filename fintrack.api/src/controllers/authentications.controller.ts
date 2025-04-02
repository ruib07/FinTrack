import { Request, Response } from "express";
import { AuthenticationService } from "../services/authentication.service.js";

export class AuthenticationsController {
  static async signin(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await new AuthenticationService().signin(email, password);

    res.status(200).json(result);
  }

  static async signup(req: Request, res: Response) {
    const result = await new AuthenticationService().signup(req.body);

    res.status(201).json(result);
  }
}
