import { type Request, type Response } from 'express';
import { BaseController } from './base-controller';
import { NounModel } from '../model/noun-model';
import { z } from 'zod';
import { createNounSchema, updateNounSchema } from '../model/schemas';

/**
 * Controller handling all noun-related HTTP requests.
 * Provides CRUD operations for nouns with input validation.
 */
export class NounController extends BaseController {
  private nounModel: NounModel;

  /**
   * Initializes a new instance of NounController.
   * Sets up the noun model for database operations.
   */
  constructor() {
    super();
    this.nounModel = new NounModel();
  }

  /**
   * Retrieves all nouns from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON array of all nouns
   * @throws {Error} When database operation fails
   */
  public async getAll(req: Request, res: Response) {
    try {
      const nouns = await this.nounModel.findAll();
      return res.json(nouns);
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Retrieves all active nouns from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON array of active nouns
   * @throws {Error} When database operation fails
   */
  public async getActive(req: Request, res: Response) {
    try {
      const nouns = await this.nounModel.findActive();
      return res.json(nouns);
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Retrieves a single noun by its ID.
   * @param {Request} req - Express request object with noun ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON object of the found noun or 404 if not found
   * @throws {Error} When database operation fails or ID format is invalid
   */
  public async getById(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const noun = await this.nounModel.findById(id);
      
      if (!noun) {
        return res.status(404).json({ message: 'Noun not found' });
      }
      
      return res.json(noun);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Creates a new noun.
   * @param {Request} req - Express request object with noun data in body
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON object of the created noun
   * @throws {Error} When validation fails or database operation fails
   */
  public async create(req: Request, res: Response) {
    try {
      const nounData = createNounSchema.parse(req.body);
      const newNoun = await this.nounModel.create(nounData);
      return res.status(201).json(newNoun);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid noun data',
          errors: error.errors
        });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Updates an existing noun by its ID.
   * @param {Request} req - Express request object with noun ID in params and update data in body
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} JSON object of the updated noun or 404 if not found
   * @throws {Error} When validation fails or database operation fails
   */
  public async update(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const nounData = updateNounSchema.parse(req.body);
      const updatedNoun = await this.nounModel.update(id, nounData);
      
      if (!updatedNoun) {
        return res.status(404).json({ message: 'Noun not found' });
      }
      
      return res.json(updatedNoun);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid noun data',
          errors: error.errors
        });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Deletes a noun by its ID.
   * Note: This will cascade delete related classes and materials.
   * @param {Request} req - Express request object with noun ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} 204 No Content on success or 404 if not found
   * @throws {Error} When database operation fails or ID format is invalid
   */
  public async delete(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const deleted = await this.nounModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Noun not found' });
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