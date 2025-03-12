import { type Request, type Response } from 'express';
import { BaseController } from './base-controller';
import { MaterialModel, type IMaterial } from '../model/material-model';

export class MaterialController extends BaseController {
  private materialModel: MaterialModel;

  constructor() {
    super();
    this.materialModel = new MaterialModel();
  }

  public async getAll(req: Request, res: Response) {
    try {
      const materials = await this.materialModel.findAll();
      return res.json(materials);
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const material = await this.materialModel.findById(id);
      
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      return res.json(material);
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const materialData: IMaterial = req.body;
      const newMaterial = await this.materialModel.create(materialData);
      return res.status(201).json(newMaterial);
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const materialData: Partial<IMaterial> = req.body;
      const updatedMaterial = await this.materialModel.update(id, materialData);
      
      if (!updatedMaterial) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      return res.json(updatedMaterial);
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.materialModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }
}