
const { prisma } = require('../config/config');

class CategoryModel {
  static async findAll() {
    return await prisma.category.findMany({
      where: { active: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    });
  }

  static async findById(id) {
    return await prisma.category.findUnique({
      where: { id },
      include: { 
        products: { where: { active: true } },
        _count: { select: { products: true } }
      }
    });
  }

  static async create(data) {
    return await prisma.category.create({ data });
  }

  static async update(id, data) {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  static async delete(id) {
    return await prisma.category.update({
      where: { id },
      data: { active: false }
    });
  }

  static async findByName(name) {
    return await prisma.category.findUnique({
      where: { name }
    });
  }
}

module.exports = CategoryModel;
