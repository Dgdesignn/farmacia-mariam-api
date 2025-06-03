
const { prisma } = require('../config/config');

class ProductModel {
  static async findAll(page = 1, limit = 10, categoryId = null, search = null) {
    const skip = (page - 1) * limit;
    const where = {
      active: true,
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { barcode: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id) {
    return await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  static async create(data) {
    return await prisma.product.create({
      data,
      include: { category: true }
    });
  }

  static async update(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
      include: { category: true }
    });
  }

  static async delete(id) {
    return await prisma.product.update({
      where: { id },
      data: { active: false }
    });
  }

  static async findByBarcode(barcode) {
    return await prisma.product.findUnique({
      where: { barcode },
      include: { category: true }
    });
  }
}

module.exports = ProductModel;
