
const { query } = require('../config/config');

class CustomerModel {
  static async findAll(page = 1, limit = 10, search = null) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE active = true';
    let params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR phone ILIKE $${paramCount} OR cpf ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const customersQuery = `
      SELECT * FROM customers
      ${whereClause}
      ORDER BY name ASC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    params.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total FROM customers
      ${whereClause}
    `;

    const [customersResult, countResult] = await Promise.all([
      query(customersQuery, params),
      query(countQuery, params.slice(0, -2))
    ]);

    const total = parseInt(countResult.rows[0].total);

    return {
      customers: customersResult.rows,
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
      SELECT * FROM customers WHERE id = $1
    `, [id]);

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async create(data) {
    const { name, email, phone, cpf, address, birth_date } = data;
    
    const result = await query(`
      INSERT INTO customers (name, email, phone, cpf, address, birth_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, email, phone, cpf, address, birth_date]);

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
      UPDATE customers 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount + 1}
    `, values);

    return await this.findById(id);
  }

  static async delete(id) {
    await query(`
      UPDATE customers 
      SET active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [id]);

    return { id, active: false };
  }

  static async findByEmail(email) {
    const result = await query(`
      SELECT * FROM customers WHERE email = $1
    `, [email]);

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async findByCpf(cpf) {
    const result = await query(`
      SELECT * FROM customers WHERE cpf = $1
    `, [cpf]);

    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

module.exports = CustomerModel;
