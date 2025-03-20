import { type Request, type Response } from 'express';
import { postgrestClient } from '../utils/postgrest-client';
import {
  materialWithDetailsSchema,
  type MaterialWithDetails
} from '@fullstack-assessment/shared';

interface SpellingSuggestion {
  word: string;
  distance: number;
}

export class SearchController {
  private readonly viewName = 'material_search_view';

  /**
   * Gets spelling suggestions for a search term using Levenshtein distance
   * @param term The term to get suggestions for
   * @returns Promise<string[]> Array of suggested words
   */
  private async getSpellingSuggestions(term: string): Promise<string[]> {
    const response = await postgrestClient.get<SpellingSuggestion[]>(
      `rpc/get_spelling_suggestions?search_term=${encodeURIComponent(term)}`
    );
    
    return response.map(suggestion => suggestion.word);
  }

  // Add a helper function to check if string contains only numbers
  private isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
  }

  /**
   * Search endpoint handler for materials
   * @param req Express request object containing search term
   * @param res Express response object
   */
  async search(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = req.query.q as string;

      if (!searchTerm) {
        res.status(400).json({ error: 'Search term is required' });
        return;
      }

      // Split search term into words and get spelling suggestions
      const words = searchTerm.trim().toLowerCase().split(/\s+/);
      const suggestions = await Promise.all(
        words.map(word => this.getSpellingSuggestions(word))
      );

      // Use original words or their best suggestion
      const searchWords = words.map((word, index) => {
        return suggestions[index][0] || word; // Use the best suggestion if available
      });

      // Combine words back into a search term
      const correctedSearchTerm = searchWords.join(' ');

      // Build the OR conditions based on search term
      const conditions = [
        `full_search_vector.fts.${encodeURIComponent(correctedSearchTerm)}`,
        `description.ilike.${encodeURIComponent('%' + correctedSearchTerm + '%')}`,
        `long_text.ilike.${encodeURIComponent('%' + correctedSearchTerm + '%')}`,
        `details.ilike.${encodeURIComponent('%' + correctedSearchTerm + '%')}`,
        `noun_name.ilike.${encodeURIComponent('%' + correctedSearchTerm + '%')}`,
        `class_name.ilike.${encodeURIComponent('%' + correctedSearchTerm + '%')}`
      ];

      // Only add material_number check if search term is numeric
      if (this.isNumeric(correctedSearchTerm)) {
        conditions.unshift(`material_number::text.ilike.${encodeURIComponent('%' + correctedSearchTerm + '%')}`);
      }

      const query = `${this.viewName}?or=(${conditions.join(',')})&order=material_number.asc&limit=100`;

      const response = await postgrestClient.get<unknown[]>(query);
      
      // Transform and validate the response
      const materials = response.map(item => materialWithDetailsSchema.parse(item));

      // Return both the search results and whether a correction was made
      res.json({
        materials,
        corrected: correctedSearchTerm !== searchTerm ? correctedSearchTerm : undefined
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Failed to perform search' });
    }
  }
} 