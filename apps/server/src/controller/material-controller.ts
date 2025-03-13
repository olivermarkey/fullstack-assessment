import { type Request, type Response } from 'express';
import { BaseController } from './base-controller';
import { MaterialModel } from '../model/material-model';
import { z } from 'zod';
import { createMaterialSchema, updateMaterialSchema } from '@fullstack-assessment/shared';

/**
 * Controller handling all material-related HTTP requests.
 * Provides CRUD operations for materials with input validation.
 */
export class MaterialController extends BaseController {
  private materialModel: MaterialModel;

  /**
   * Initializes a new instance of MaterialController.
   * Sets up the material model for database operations.
   */
  constructor() {
    super();
    this.materialModel = new MaterialModel();
  }

  /**
   * Retrieves all materials from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON array of all materials
   * @throws {Error} When database operation fails
   */
  public async getAll(req: Request, res: Response) {
    try {
      const materials = await this.materialModel.findAll();
      return res.json({materials});
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Retrieves a single material by its ID.
   * @param {Request} req - Express request object with material ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON object of the found material or 404 if not found
   * @throws {Error} When database operation fails or ID format is invalid
   */
  public async getById(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const material = await this.materialModel.findById(id);
      
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      return res.json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Creates a new material.
   * @param {Request} req - Express request object with material data in body
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON object of the created material
   * @throws {Error} When validation fails or database operation fails
   */
  public async create(req: Request, res: Response) {
    try {
      const materialData = createMaterialSchema.parse(req.body);
      const newMaterial = await this.materialModel.create(materialData);
      return res.status(201).json(newMaterial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid material data',
          errors: error.errors
        });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Updates an existing material by its ID.
   * @param {Request} req - Express request object with material ID in params and update data in body
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON object of the updated material or 404 if not found
   * @throws {Error} When validation fails or database operation fails
   */
  public async update(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const materialData = updateMaterialSchema.parse(req.body);
      const updatedMaterial = await this.materialModel.update(id, materialData);
      
      if (!updatedMaterial) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      return res.json(updatedMaterial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid material data',
          errors: error.errors
        });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Deletes a material by its ID.
   * @param {Request} req - Express request object with material ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} 204 No Content on success or 404 if not found
   * @throws {Error} When database operation fails or ID format is invalid
   */
  public async delete(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const deleted = await this.materialModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }
}