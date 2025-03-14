import { Router, type Request, type Response } from "express";
import authController from "../controller/auth-controller";


const authRouter = Router();

authRouter.post("/login", (req: Request, res: Response) => {
  authController.login(req, res);
});
authRouter.post("/register", (req: Request, res: Response) => {
  authController.register(req, res);
});

export default authRouter;
