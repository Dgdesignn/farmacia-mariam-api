
const { prisma } = require('../config/config');

class CustomerModel {
  static async findAll(page = 1, limit = 10, search = null) {
    const skip = (page - 1) * limit;
    const where = {
      active: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { cpf: { contains: search } }
        ]
      })
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.customer.count({ where })
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id) {
    return await prisma.customer.findUnique({
      where: { id }
    });
  }

  static async create(data) {
    return await prisma.customer.create({ data });
  }

  static async update(id, data) {
    return await prisma.customer.update({
      where: { id },
      data
    });
  }

  static async delete(id) {
    return await prisma.customer.update({
      where: { id },
      data: { active: false }
    });
  }

  static async findByEmail(email) {
    return await prisma.customer.findUnique({
      where: { email }
    });
  }

  static async findByCpf(cpf) {
    return await prisma.customer.findUnique({
      where: { cpf }
    });
  }
}

module.exports = CustomerModel;
