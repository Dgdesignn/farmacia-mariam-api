
import { supabase } from '../config/config.js';

class ProductModel {
  static async findAll(page = 1, limit = 10, categoryId = null, search = null) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner(
          id,
          name,
          description
        )
      `)
      .eq('active', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,barcode.ilike.%${search}%`);
    }

    // Buscar dados paginados
    const { data: products, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    // Buscar total para paginação
    let countQuery = supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('active', true);

    if (categoryId) {
      countQuery = countQuery.eq('category_id', categoryId);
    }

    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%,barcode.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQuery;
    if (countError) throw new Error(countError.message);

    const formattedProducts = products.map(product => ({
      ...product,
      category: product.categories ? {
        id: product.categories.id,
        name: product.categories.name,
        description: product.categories.description
      } : null
    }));

    return {
      products: formattedProducts,
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
      .from('products')
      .select(`
        *,
        categories(
          id,
          name,
          description
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return {
      ...data,
      category: data.categories ? {
        id: data.categories.id,
        name: data.categories.name,
        description: data.categories.description
      } : null
    };
  }

  static async create(data) {
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock || 0,
        barcode: data.barcode,
        category_id: data.category_id
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return await this.findById(product.id);
  }

  static async update(id, data) {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.category_id !== undefined) updateData.category_id = data.category_id;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (error) throw new Error(error.message);
    return await this.findById(id);
  }

  static async delete(id) {
    const { error } = await supabase
      .from('products')
      .update({ 
        active: false, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { id, active: false };
  }

  static async findByBarcode(barcode) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(
          id,
          name,
          description
        )
      `)
      .eq('barcode', barcode)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return {
      ...data,
      category: data.categories ? {
        id: data.categories.id,
        name: data.categories.name,
        description: data.categories.description
      } : null
    };
  }
}

export default ProductModel;
