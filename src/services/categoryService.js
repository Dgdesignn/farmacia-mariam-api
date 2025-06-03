
const CategoryModel = require('../models/categoryModel');

class CategoryService {
  static async getAllCategories() {
    return await CategoryModel.findAll();
  }

  static async getCategoryById(id) {
    const category = await CategoryModel.findById(id);
    if (!category || !category.active) {
      throw new Error('Categoria não encontrada');
    }
    return category;
  }

  static async createCategory(data) {
    // Verificar se o nome já existe
    const existingCategory = await CategoryModel.findByName(data.name);
    if (existingCategory) {
      throw new Error('Nome da categoria já existe');
    }

    return await CategoryModel.create(data);
  }

  static async updateCategory(id, data) {
    const category = await CategoryModel.findById(id);
    if (!category || !category.active) {
      throw new Error('Categoria não encontrada');
    }

    // Verificar se o nome já existe (exceto para a categoria atual)
    if (data.name && data.name !== category.name) {
      const existingCategory = await CategoryModel.findByName(data.name);
      if (existingCategory) {
        throw new Error('Nome da categoria já existe');
      }
    }

    return await CategoryModel.update(id, data);
  }

  static async deleteCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category || !category.active) {
      throw new Error('Categoria não encontrada');
    }

    // Verificar se existem produtos ativos nesta categoria
    if (category._count.products > 0) {
      throw new Error('Não é possível excluir categoria com produtos ativos');
    }

    return await CategoryModel.delete(id);
  }
}

module.exports = CategoryService;
