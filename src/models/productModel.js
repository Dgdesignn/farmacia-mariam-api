
const { query } = require('../config/config');

class ProductModel {
  static async findAll(page = 1, limit = 10, categoryId = null, search = null) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE p.active = true';
    let params = [];
    let paramCount = 0;

    if (categoryId) {
      paramCount++;
      whereClause += ` AND p.category_id = $${paramCount}`;
      params.push(categoryId);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.barcode ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const productsQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    params.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `;

    const [productsResult, countResult] = await Promise.all([
      query(productsQuery, params),
      query(countQuery, params.slice(0, -2))
    ]);

    const products = productsResult.rows.map(row => ({
      ...row,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description
      } : null
    }));

    const total = parseInt(countResult.rows[0].total);

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
    const result = await query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description
      } : null
    };
  }

  static async create(data) {
    const { name, description, price, stock, barcode, category_id } = data;
    
    const result = await query(`
      INSERT INTO products (name, description, price, stock, barcode, category_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, price, stock || 0, barcode, category_id]);

    return await this.findById(result.rows[0].id);
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) return null;

    paramCount++;
    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    values.push(id);

    await query(`
      UPDATE products 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount + 1}
    `, values);

    return await this.findById(id);
  }

  static async delete(id) {
    await query(`
      UPDATE products 
      SET active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [id]);

    return { id, active: false };
  }

  static async findByBarcode(barcode) {
    const result = await query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.barcode = $1
    `, [barcode]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description
      } : null
    };
  }
}

module.exports = ProductModel;
