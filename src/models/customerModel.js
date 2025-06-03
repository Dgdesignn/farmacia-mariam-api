
const { supabase } = require('../config/config');

class CustomerModel {
  static async findAll(page = 1, limit = 10, search = null) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('customers')
      .select('*')
      .eq('active', true);

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,cpf.ilike.%${search}%`);
    }

    // Buscar dados paginados
    const { data: customers, error } = await query
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    // Buscar total para paginação
    let countQuery = supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('active', true);

    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,cpf.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQuery;
    if (countError) throw new Error(countError.message);

    return {
      customers,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    };
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }

  static async create(data) {
    const { data: customer, error } = await supabase
      .from('customers')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        address: data.address,
        birth_date: data.birth_date
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return customer;
  }

  static async update(id, data) {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.cpf !== undefined) updateData.cpf = data.cpf;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.birth_date !== undefined) updateData.birth_date = data.birth_date;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id);

    if (error) throw new Error(error.message);
    return await this.findById(id);
  }

  static async delete(id) {
    const { error } = await supabase
      .from('customers')
      .update({ 
        active: false, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { id, active: false };
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }

  static async findByCpf(cpf) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('cpf', cpf)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }
}

module.exports = CustomerModel;
