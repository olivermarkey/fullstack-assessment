import { postgrestClient } from '../utils/postgrest-client';
import {
  materialSchema,
  createMaterialSchema,
  updateMaterialSchema,
  type Material,
  type CreateMaterial,
  type UpdateMaterial,
} from '@fullstack-assessment/shared';

/**
 * Model class for handling Material database operations.
 * Provides CRUD operations with data validation using Zod schemas.
 * Communicates with the PostgreSQL database through PostgREST.
 */
export class MaterialModel {
  private readonly tableName = 'material';

  /**
   * Retrieves all materials from the database.
   * @returns {Promise<Material[]>} Array of materials with validated schema
   * @throws {Error} When database operation fails or response validation fails
   */
  async findAll(): Promise<Material[]> {
    const response = await postgrestClient.get<unknown[]>(this.tableName);
    return response.map(item => materialSchema.parse(item));
  }

  /**
   * Retrieves a single material by its ID.
   * @param {string} id - The unique identifier of the material
   * @returns {Promise<Material | null>} Material object if found, null otherwise
   * @throws {Error} When database operation fails or response validation fails
   */
  async findById(id: string): Promise<Material | null> {
    const response = await postgrestClient.get<unknown[]>(`${this.tableName}?id=eq.${id}`);
    if (!response.length) return null;
    return materialSchema.parse(response[0]);
  }

  /**
   * Creates a new material in the database.
   * @param {CreateMaterial} data - The material data to create
   * @returns {Promise<Material>} The created material with generated ID
   * @throws {Error} When validation fails or database operation fails
   */
  async create(data: CreateMaterial): Promise<Material> {
    const validatedData = createMaterialSchema.parse(data);
    const response = await postgrestClient.post<unknown>(this.tableName, validatedData);
    return materialSchema.parse(response);
  }

  /**
   * Updates an existing material by its ID.
   * @param {string} id - The unique identifier of the material to update
   * @param {UpdateMaterial} data - The partial material data to update
   * @returns {Promise<Material | null>} Updated material if found, null otherwise
   * @throws {Error} When validation fails or database operation fails
   */
  async update(id: string, data: UpdateMaterial): Promise<Material | null> {
    const validatedData = updateMaterialSchema.parse(data);
    const response = await postgrestClient.patch<unknown[]>(
      `${this.tableName}?id=eq.${id}`,
      validatedData
    );
    if (!response.length) return null;
    return materialSchema.parse(response[0]);
  }

  /**
   * Deletes a material by its ID.
   * @param {string} id - The unique identifier of the material to delete
   * @returns {Promise<boolean>} True if material was deleted, false if not found
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
export type { Material, CreateMaterial, UpdateMaterial };
