import { Router, type Request, type Response } from "express";
import { ClassController } from "server/controller/class-controller";

const classRouter = Router();
const classController = new ClassController();

// Get all classes
classRouter.get("/", (req: Request, res: Response) => {
  classController.getAll(req, res);
});

// Get active classes
classRouter.get("/active", (req: Request, res: Response) => {
  classController.getActive(req, res);
});

// Get classes by noun ID
classRouter.get("/noun/:nounId", (req: Request, res: Response) => {
  classController.getByNounId(req, res);
});

// Get active classes by noun ID
classRouter.get("/noun/:nounId/active", (req: Request, res: Response) => {
  classController.getActiveByNounId(req, res);
});

// Get class by ID
classRouter.get("/:id", (req: Request, res: Response) => {
  classController.getById(req, res);
});

// Create new class
classRouter.post("/", (req: Request, res: Response) => {
  classController.create(req, res);
});

// Update class
classRouter.patch("/:id", (req: Request, res: Response) => {
  classController.update(req, res);
});

// Delete class
classRouter.delete("/:id", (req: Request, res: Response) => {
  classController.delete(req, res);
});

export default classRouter; 