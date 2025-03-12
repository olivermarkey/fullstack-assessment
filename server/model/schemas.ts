import { z } from 'zod';

// Base schemas for each table
export const nounSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean().default(true),
});

export const classSchema = z.object({
  id: z.string(),
  noun_id: z.string(),
  name: z.string(),
  active: z.boolean().default(true),
});

export const materialSchema = z.object({
  id: z.string(),
  material_number: z.number().int(),
  description: z.string(),
  long_text: z.string().nullable(),
  details: z.string().nullable(),
  noun_id: z.string(),
  class_id: z.string(),
});

// Input schemas for Noun
export const createNounSchema = nounSchema.omit({ id: true });
export const updateNounSchema = nounSchema.partial().omit({ id: true });

// Input schemas for Class
export const createClassSchema = classSchema.omit({ id: true });
export const updateClassSchema = classSchema.partial().omit({ id: true });

// Input schemas for Material
export const createMaterialSchema = materialSchema.omit({ id: true });
export const updateMaterialSchema = materialSchema.partial().omit({ id: true });

// Infer types from schemas
export type Noun = z.infer<typeof nounSchema>;
export type CreateNoun = z.infer<typeof createNounSchema>;
export type UpdateNoun = z.infer<typeof updateNounSchema>;

export type Class = z.infer<typeof classSchema>;
export type CreateClass = z.infer<typeof createClassSchema>;
export type UpdateClass = z.infer<typeof updateClassSchema>;

export type Material = z.infer<typeof materialSchema>;
export type CreateMaterial = z.infer<typeof createMaterialSchema>;
export type UpdateMaterial = z.infer<typeof updateMaterialSchema>; 