import { type Request, type Response } from 'express';
import { BaseController } from './base-controller';
import { ClassModel } from '../model/class-model';
import { z } from 'zod';
import { createClassSchema, updateClassSchema } from '../model/schemas';

/**
 * Controller handling all class-related HTTP requests.
 * Provides CRUD operations for classes with input validation.
 */
export class ClassController extends BaseController {
  private classModel: ClassModel;

  /**
   * Initializes a new instance of ClassController.
   * Sets up the class model for database operations.
   */
  constructor() {
    super();
    this.classModel = new ClassModel();
  }

  /**
   * Retrieves all classes from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON array of all classes
   * @throws {Error} When database operation fails
   */
  public async getAll(req: Request, res: Response) {
    try {
      const classes = await this.classModel.findAll();
      return res.json(classes);
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Retrieves all active classes from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON array of active classes
   * @throws {Error} When database operation fails
   */
  public async getActive(req: Request, res: Response) {
    try {
      const classes = await this.classModel.findActive();
      return res.json(classes);
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Retrieves all classes for a specific noun.
   * @param {Request} req - Express request object with noun ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON array of classes for the specified noun
   * @throws {Error} When database operation fails or noun ID format is invalid
   */
  public async getByNounId(req: Request, res: Response) {
    try {
      const nounId = z.string().parse(req.params.nounId);
      const classes = await this.classModel.findByNounId(nounId);
      return res.json(classes);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid noun ID format' });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Retrieves all active classes for a specific noun.
   * @param {Request} req - Express request object with noun ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON array of active classes for the specified noun
   * @throws {Error} When database operation fails or noun ID format is invalid
   */
  public async getActiveByNounId(req: Request, res: Response) {
    try {
      const nounId = z.string().parse(req.params.nounId);
      const classes = await this.classModel.findActiveByNounId(nounId);
      return res.json(classes);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid noun ID format' });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Retrieves a single class by its ID.
   * @param {Request} req - Express request object with class ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON object of the found class or 404 if not found
   * @throws {Error} When database operation fails or ID format is invalid
   */
  public async getById(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const classItem = await this.classModel.findById(id);
      
      if (!classItem) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      return res.json(classItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Creates a new class.
   * @param {Request} req - Express request object with class data in body
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON object of the created class
   * @throws {Error} When validation fails or database operation fails
   */
  public async create(req: Request, res: Response) {
    try {
      const classData = createClassSchema.parse(req.body);
      const newClass = await this.classModel.create(classData);
      return res.status(201).json(newClass);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid class data',
          errors: error.errors
        });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Updates an existing class by its ID.
   * @param {Request} req - Express request object with class ID in params and update data in body
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON object of the updated class or 404 if not found
   * @throws {Error} When validation fails or database operation fails
   */
  public async update(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const classData = updateClassSchema.parse(req.body);
      const updatedClass = await this.classModel.update(id, classData);
      
      if (!updatedClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      return res.json(updatedClass);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid class data',
          errors: error.errors
        });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Deletes a class by its ID.
   * Note: This will cascade delete related materials.
   * @param {Request} req - Express request object with class ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} 204 No Content on success or 404 if not found
   * @throws {Error} When database operation fails or ID format is invalid
   */
  public async delete(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const deleted = await this.classModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Class not found' });
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