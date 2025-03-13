import { postgrestClient } from '../utils/postgrest-client';
import {
  classSchema,
  createClassSchema,
  updateClassSchema,
  type Class,
  type CreateClass,
  type UpdateClass,
} from '@fullstack-assessment/shared';

/**
 * Model class for handling Class database operations.
 * Provides CRUD operations with data validation using Zod schemas.
 * Communicates with the PostgreSQL database through PostgREST.
 */
export class ClassModel {
  private readonly tableName = 'class';

  /**
   * Retrieves all classes from the database.
   * @returns {Promise<Class[]>} Array of classes with validated schema
   * @throws {Error} When database operation fails or response validation fails
   */
  async findAll(): Promise<Class[]> {
    const response = await postgrestClient.get<unknown[]>(this.tableName);
    return response.map(item => classSchema.parse(item));
  }

  /**
   * Retrieves a single class by its ID.
   * @param {string} id - The unique identifier of the class
   * @returns {Promise<Class | null>} Class object if found, null otherwise
   * @throws {Error} When database operation fails or response validation fails
   */
  async findById(id: string): Promise<Class | null> {
    const response = await postgrestClient.get<unknown[]>(`${this.tableName}?id=eq.${id}`);
    if (!response.length) return null;
    return classSchema.parse(response[0]);
  }

  /**
   * Retrieves all classes for a specific noun.
   * @param {string} nounId - The ID of the noun to find classes for
   * @returns {Promise<Class[]>} Array of classes belonging to the specified noun
   * @throws {Error} When database operation fails or response validation fails
   */
  async findByNounId(nounId: string): Promise<Class[]> {
    const response = await postgrestClient.get<unknown[]>(`${this.tableName}?noun_id=eq.${nounId}`);
    return response.map(item => classSchema.parse(item));
  }

  /**
   * Retrieves all active classes.
   * @returns {Promise<Class[]>} Array of active classes
   * @throws {Error} When database operation fails or response validation fails
   */
  async findActive(): Promise<Class[]> {
    const response = await postgrestClient.get<unknown[]>(`${this.tableName}?active=eq.true`);
    return response.map(item => classSchema.parse(item));
  }

  /**
   * Retrieves all active classes for a specific noun.
   * @param {string} nounId - The ID of the noun to find active classes for
   * @returns {Promise<Class[]>} Array of active classes belonging to the specified noun
   * @throws {Error} When database operation fails or response validation fails
   */
  async findActiveByNounId(nounId: string): Promise<Class[]> {
    const response = await postgrestClient.get<unknown[]>(
      `${this.tableName}?noun_id=eq.${nounId}&active=eq.true`
    );
    return response.map(item => classSchema.parse(item));
  }

  /**
   * Creates a new class in the database.
   * @param {CreateClass} data - The class data to create
   * @returns {Promise<Class>} The created class with generated ID
   * @throws {Error} When validation fails or database operation fails
   */
  async create(data: CreateClass): Promise<Class> {
    const validatedData = createClassSchema.parse(data);
    const response = await postgrestClient.post<unknown>(this.tableName, validatedData);
    return classSchema.parse(response);
  }

  /**
   * Updates an existing class by its ID.
   * @param {string} id - The unique identifier of the class to update
   * @param {UpdateClass} data - The partial class data to update
   * @returns {Promise<Class | null>} Updated class if found, null otherwise
   * @throws {Error} When validation fails or database operation fails
   */
  async update(id: string, data: UpdateClass): Promise<Class | null> {
    const validatedData = updateClassSchema.parse(data);
    const response = await postgrestClient.patch<unknown[]>(
      `${this.tableName}?id=eq.${id}`,
      validatedData
    );
    if (!response.length) return null;
    return classSchema.parse(response[0]);
  }

  /**
   * Deletes a class by its ID.
   * @param {string} id - The unique identifier of the class to delete
   * @returns {Promise<boolean>} True if class was deleted, false if not found
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
export type { Class, CreateClass, UpdateClass }; 