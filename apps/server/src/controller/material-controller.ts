import { type Request, type Response } from "express";
import { BaseController } from "./base-controller";
import { MaterialModel } from "../model/material-model";
import { NounModel } from "../model/noun-model";
import { ClassModel } from "../model/class-model";
import { z } from "zod";
import {
  createMaterialSchema,
  updateMaterialSchema,
} from "@fullstack-assessment/shared";
import ExcelJS from "exceljs";
/**
 * Controller handling all material-related HTTP requests.
 * Provides CRUD operations for materials with input validation.
 */
export class MaterialController extends BaseController {
  private materialModel: MaterialModel;
  private nounModel: NounModel;
  private classModel: ClassModel;

  /**
   * Initializes a new instance of MaterialController.
   * Sets up the material model for database operations.
   */
  constructor() {
    super();
    this.materialModel = new MaterialModel();
    this.nounModel = new NounModel();
    this.classModel = new ClassModel();
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
      return res.json({ materials });
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
        return res.status(404).json({ message: "Material not found" });
      }

      return res.json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ID format" });
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
      console.log("[Material Controller] New Material:", newMaterial);
      return res.status(201).json(newMaterial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("[Material Controller] Zod Error:", error.errors);
        return res.status(400).json({
          message: "Invalid material data",
          errors: error.errors,
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
        return res.status(404).json({ message: "Material not found" });
      }

      return res.json(updatedMaterial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid material data",
          errors: error.errors,
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
        return res.status(404).json({ message: "Material not found" });
      }

      return res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }

  /**
   * Generates a bulk enrichment template for materials.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Excel file with materials and reference data
   * @throws {Error} When database operation fails
   */
  public async bulkEnrichment(req: Request, res: Response) {
    try {
      const nouns = await this.nounModel.findActive();
      const classes = await this.classModel.findActive();
      const materials = await this.materialModel.findAll();

      const workbook = new ExcelJS.Workbook();
      const sheet1 = workbook.addWorksheet("Materials");
      const sheet2 = workbook.addWorksheet("Lists");

      // Define Columns in Sheet1
      sheet1.columns = [
        { header: "Material Number", key: "materialNumber", width: 15 },
        { header: "Noun", key: "noun", width: 32 },
        { header: "Class", key: "class", width: 32 },
      ];

      // Add existing materials data
      materials.forEach(material => {
        sheet1.addRow({
          materialNumber: material.material_number,
          noun: material.noun_name || "",
          class: material.class_name || ""
        });
      });

      // --- Populate Sheet2 (Lists) ---
      // Add nouns in column A
      sheet2.getCell('A1').value = 'Nouns';
      const nounNames = nouns.map(n => n.name);
      
      // Add each noun to its own row
      nounNames.forEach((name, index) => {
        sheet2.getCell(`A${index + 2}`).value = name;
      });

      // Add classes by noun starting from column C
      let currentColumn = 'C';
      nouns.forEach(noun => {
        const nounClasses = classes.filter(c => c.noun_id === noun.id);
        if (nounClasses.length > 0) {
          // Add noun name as column header
          sheet2.getCell(`${currentColumn}1`).value = noun.name;
          
          // Add classes under the noun
          nounClasses.forEach((cls, index) => {
            sheet2.getCell(`${currentColumn}${index + 2}`).value = cls.name;
          });
          
          // Move to next column
          currentColumn = String.fromCharCode(currentColumn.charCodeAt(0) + 1);
        }
      });

      // Hide the Lists sheet
      sheet2.state = 'hidden';

      // Add data validation for Noun column (Column B)
      for (let i = 2; i <= 1000; i++) {
        sheet1.getCell(`B${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`Lists!$A$2:$A$${nounNames.length + 1}`]
        };
      }

      // Add data validation for Class column (Column C)
      for (let i = 2; i <= 1000; i++) {
        sheet1.getCell(`C${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`=OFFSET(Lists!$C$2,0,MATCH(B${i},Lists!$C$1:$Z$1,0)-1,COUNTIF(OFFSET(Lists!$C$2,0,MATCH(B${i},Lists!$C$1:$Z$1,0)-1,100),"<>"),1)`]
        };
      }

      // Set headers for download with no-cache directives
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=Bulk_Enrichment_Template.xlsx');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Write to response and end
      return workbook.xlsx.write(res);
    } catch (error) {
      const errorResponse = this.handleError(error as Error);
      return res.status(500).json(errorResponse);
    }
  }
}
