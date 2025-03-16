import { postgrestClient } from '../utils/postgrest-client';
import {
  materialSchema,
  materialWithDetailsSchema,
  createMaterialSchema,
  updateMaterialSchema,
  type Material,
  type MaterialWithDetails,
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
   * Retrieves all materials from the database with joined noun and class details.
   * @returns {Promise<MaterialWithDetails[]>} Array of materials with joined details
   * @throws {Error} When database operation fails or response validation fails
   */
  async findAll(): Promise<MaterialWithDetails[]> {
    const query = `${this.tableName}?select=id,material_number,long_text,description,details,noun:noun_id(name),class:class_id(name)`;
    const response = await postgrestClient.get<unknown[]>(query);
    
    // Transform the nested response to flat structure
    const transformedResponse = response.map(item => {
      const material = item as any;
      return {
        id: material.id,
        material_number: material.material_number,
        long_text: material.long_text,
        description: material.description,
        details: material.details,
        noun_name: material.noun.name,
        class_name: material.class.name,
      };
    });

    return transformedResponse.map(item => materialWithDetailsSchema.parse(item));
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
    const response = await postgrestClient.post<unknown[]>(this.tableName, validatedData);
    if (!Array.isArray(response) || response.length === 0) {
        throw new Error('PostgREST returned an invalid response');
    }
    return materialSchema.parse(response[0]);
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
export type { Material, CreateMaterial, UpdateMaterial, MaterialWithDetails };
