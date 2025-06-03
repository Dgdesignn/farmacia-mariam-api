
const { query } = require('../config/config');

class CategoryModel {
  static async findAll() {
    const result = await query(`
      SELECT 
        c.*,
        COUNT(p.id) as products_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.active = true
      WHERE c.active = true
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    return result.rows.map(row => ({
      ...row,
      _count: { products: parseInt(row.products_count) }
    }));
  }

  static async findById(id) {
    const categoryResult = await query(`
      SELECT * FROM categories WHERE id = $1
    `, [id]);

    if (categoryResult.rows.length === 0) return null;

    const productsResult = await query(`
      SELECT * FROM products WHERE category_id = $1 AND active = true
    `, [id]);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM products WHERE category_id = $1 AND active = true
    `, [id]);

    return {
      ...categoryResult.rows[0],
      products: productsResult.rows,
      _count: { products: parseInt(countResult.rows[0].total) }
    };
  }

  static async create(data) {
    const { name, description } = data;
    
    const result = await query(`
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `, [name, description]);

    return result.rows[0];
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
      UPDATE categories 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount + 1}
    `, values);

    return await this.findById(id);
  }

  static async delete(id) {
    await query(`
      UPDATE categories 
      SET active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [id]);

    return { id, active: false };
  }

  static async findByName(name) {
    const result = await query(`
      SELECT * FROM categories WHERE name = $1
    `, [name]);

    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

module.exports = CategoryModel;
