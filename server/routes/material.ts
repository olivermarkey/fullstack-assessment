import { Router, type Request, type Response } from "express";
import { MaterialController } from "server/controller/material-controller";

const materialRouter = Router();
const materialController = new MaterialController();

materialRouter.get("/", (req: Request, res: Response) => {
  materialController.getAll(req, res);
});
materialRouter.get("/:id", (req: Request, res: Response) => {
  materialController.getById(req, res);
});
materialRouter.post("/", (req: Request, res: Response) => {
  materialController.create(req, res);
});

export default materialRouter;
