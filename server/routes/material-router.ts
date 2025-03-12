import { Router, type Request, type Response } from "express";
import { MaterialController } from "server/controller/material-controller";

const materialRouter = Router();
const materialController = new MaterialController();

// Get all materials
materialRouter.get("/", (req: Request, res: Response) => {
  materialController.getAll(req, res);
});

// Get material by ID
materialRouter.get("/:id", (req: Request, res: Response) => {
  materialController.getById(req, res);
});

// Create new material
materialRouter.post("/", (req: Request, res: Response) => {
  materialController.create(req, res);
});

// Update material
materialRouter.patch("/:id", (req: Request, res: Response) => {
  materialController.update(req, res);
});

// Delete material
materialRouter.delete("/:id", (req: Request, res: Response) => {
  materialController.delete(req, res);
});

export default materialRouter;
