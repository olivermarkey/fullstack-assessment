import { Router, type Request, type Response } from "express";
import { NounController } from "server/controller/noun-controller";

const nounRouter = Router();
const nounController = new NounController();

// Get all nouns
nounRouter.get("/", (req: Request, res: Response) => {
  nounController.getAll(req, res);
});

// Get active nouns
nounRouter.get("/active", (req: Request, res: Response) => {
  nounController.getActive(req, res);
});

// Get noun by ID
nounRouter.get("/:id", (req: Request, res: Response) => {
  nounController.getById(req, res);
});

// Create new noun
nounRouter.post("/", (req: Request, res: Response) => {
  nounController.create(req, res);
});

// Update noun
nounRouter.patch("/:id", (req: Request, res: Response) => {
  nounController.update(req, res);
});

// Delete noun
nounRouter.delete("/:id", (req: Request, res: Response) => {
  nounController.delete(req, res);
});

export default nounRouter; 