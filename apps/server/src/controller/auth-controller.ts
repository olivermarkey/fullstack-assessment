import { BaseController } from "./base-controller";
import { type Request, type Response } from "express";

export class AuthController extends BaseController {
  constructor() {
    super();
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    return res.status(200).json({ message: "Login successful" });
  }

  public async register(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log("[AuthController] register: ", email, password);
    return res.status(200).json({ message: "Register successful" });
  }
}

export default new AuthController();