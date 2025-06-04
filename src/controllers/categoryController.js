
import CategoryService from '../services/categoryService.js';
import { validationResult } from 'express-validator';

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);
      res.json(category);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async createCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const category = await CategoryService.updateCategory(id, req.body);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const result = await CategoryService.deleteCategory(id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default CategoryController;
