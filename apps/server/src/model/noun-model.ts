import { postgrestClient } from '../utils/postgrest-client';
import {
  nounSchema,
  createNounSchema,
  updateNounSchema,
  type Noun,
  type CreateNoun,
  type UpdateNoun,
} from '@fullstack-assessment/shared';

/**
 * Model class for handling Noun database operations.
 * Provides CRUD operations with data validation using Zod schemas.
 * Communicates with the PostgreSQL database through PostgREST.
 */
export class NounModel {
  private readonly tableName = 'noun';

  /**
   * Retrieves all nouns from the database.
   * @returns {Promise<Noun[]>} Array of nouns with validated schema
   * @throws {Error} When database operation fails or response validation fails
   */
  async findAll(): Promise<Noun[]> {
    const response = await postgrestClient.get<unknown[]>(this.tableName);
    return response.map(item => nounSchema.parse(item));
  }

  /**
   * Retrieves a single noun by its ID.
   * @param {string} id - The unique identifier of the noun
   * @returns {Promise<Noun | null>} Noun object if found, null otherwise
   * @throws {Error} When database operation fails or response validation fails
   */
  async findById(id: string): Promise<Noun | null> {
    const response = await postgrestClient.get<unknown[]>(`${this.tableName}?id=eq.${id}`);
    if (!response.length) return null;
    return nounSchema.parse(response[0]);
  }

  /**
   * Retrieves all active nouns.
   * @returns {Promise<Noun[]>} Array of active nouns
   * @throws {Error} When database operation fails or response validation fails
   */
  async findActive(): Promise<Noun[]> {
    const response = await postgrestClient.get<unknown[]>(`${this.tableName}?active=eq.true`);
    return response.map(item => nounSchema.parse(item));
  }

  /**
   * Creates a new noun in the database.
   * @param {CreateNoun} data - The noun data to create
   * @returns {Promise<Noun>} The created noun with generated ID
   * @throws {Error} When validation fails or database operation fails
   */
  async create(data: CreateNoun): Promise<Noun> {
    const validatedData = createNounSchema.parse(data);
    const response = await postgrestClient.post<unknown[]>(this.tableName, validatedData);
    if (!Array.isArray(response) || response.length === 0) {
        throw new Error('PostgREST returned an invalid response');
    }
    return nounSchema.parse(response[0]);
  }

  /**
   * Updates an existing noun by its ID.
   * @param {string} id - The unique identifier of the noun to update
   * @param {UpdateNoun} data - The partial noun data to update
   * @returns {Promise<Noun | null>} Updated noun if found, null otherwise
   * @throws {Error} When validation fails or database operation fails
   */
  async update(id: string, data: UpdateNoun): Promise<Noun | null> {
    const validatedData = updateNounSchema.parse(data);
    const response = await postgrestClient.patch<unknown[]>(
      `${this.tableName}?id=eq.${id}`,
      validatedData
    );
    if (!response.length) return null;
    return nounSchema.parse(response[0]);
  }

  /**
   * Deletes a noun by its ID.
   * Note: This will cascade delete related classes and materials.
   * @param {string} id - The unique identifier of the noun to delete
   * @returns {Promise<boolean>} True if noun was deleted, false if not found
   * @throws {Error} When database operation fails
   */
  async delete(id: string): Promise<boolean> {
    try {
      await postgrestClient.delete(`${this.tableName}?id=eq.${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export the types
export type { Noun, CreateNoun, UpdateNoun }; 