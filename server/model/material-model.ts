interface IMaterial {
  id?: number;
  name: string;
  // Add other properties as needed
}

export class MaterialModel {
  private materials: IMaterial[] = []; // This will be replaced with actual DB connection

  async findAll(): Promise<IMaterial[]> {
    // In a real app, this would be a DB query
    return this.materials;
  }

  async findById(id: number): Promise<IMaterial | null> {
    const material = this.materials.find(m => m.id === id);
    return material || null;
  }

  async create(material: IMaterial): Promise<IMaterial> {
    const newId = this.materials.length + 1;
    const newMaterial = { ...material, id: newId };
    this.materials.push(newMaterial);
    return newMaterial;
  }

  async update(id: number, material: Partial<IMaterial>): Promise<IMaterial | null> {
    const index = this.materials.findIndex(m => m.id === id);
    if (index === -1) return null;
    
    this.materials[index] = { ...this.materials[index], ...material };
    return this.materials[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.materials.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    this.materials.splice(index, 1);
    return true;
  }
}

// Export the interface for use in other files
export type { IMaterial };
