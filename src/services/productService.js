
import ProductModel from '../models/productModel.js';
import CategoryModel from '../models/categoryModel.js';

class ProductService {
  static async getAllProducts(page, limit, categoryId, search) {
    return await ProductModel.findAll(page, limit, categoryId, search);
  }

  static async getProductById(id) {
    const product = await ProductModel.findById(id);
    if (!product || !product.active) {
      throw new Error('Produto não encontrado');
    }
    return product;
  }

  static async createProduct(data) {
    // Verificar se a categoria existe
    const category = await CategoryModel.findById(data.categoryId);
    if (!category || !category.active) {
      throw new Error('Categoria não encontrada');
    }

    // Verificar se o código de barras já existe
    if (data.barcode) {
      const existingProduct = await ProductModel.findByBarcode(data.barcode);
      if (existingProduct) {
        throw new Error('Código de barras já existe');
      }
    }

    return await ProductModel.create(data);
  }

  static async updateProduct(id, data) {
    const product = await ProductModel.findById(id);
    if (!product || !product.active) {
      throw new Error('Produto não encontrado');
    }

    // Verificar categoria se fornecida
    if (data.categoryId) {
      const category = await CategoryModel.findById(data.categoryId);
      if (!category || !category.active) {
        throw new Error('Categoria não encontrada');
      }
    }

    // Verificar código de barras se fornecido
    if (data.barcode && data.barcode !== product.barcode) {
      const existingProduct = await ProductModel.findByBarcode(data.barcode);
      if (existingProduct) {
        throw new Error('Código de barras já existe');
      }
    }

    return await ProductModel.update(id, data);
  }

  static async deleteProduct(id) {
    const product = await ProductModel.findById(id);
    if (!product || !product.active) {
      throw new Error('Produto não encontrado');
    }

    return await ProductModel.delete(id);
  }

  static async getProductByBarcode(barcode) {
    const product = await ProductModel.findByBarcode(barcode);
    if (!product || !product.active) {
      throw new Error('Produto não encontrado');
    }
    return product;
  }
}

export default ProductService;
