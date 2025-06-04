
import { supabase } from '../config/config.js';

class CategoryModel {
  static async findAll() {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        products!inner(id)
      `)
      .eq('active', true)
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);

    return data.map(category => ({
      ...category,
      _count: { products: category.products ? category.products.length : 0 }
    }));
  }

  static async findById(id) {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', id)
      .eq('active', true);

    if (productsError) throw new Error(productsError.message);

    return {
      ...category,
      products: products || [],
      _count: { products: products ? products.length : 0 }
    };
  }

  static async create(data) {
    const { data: category, error } = await supabase
      .from('categories')
      .insert([{
        name: data.name,
        description: data.description
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return category;
  }

  static async update(id, data) {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    updateData.updated_at = new Date().toISOString();

    const { data: category, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return await this.findById(id);
  }

  static async delete(id) {
    const { error } = await supabase
      .from('categories')
      .update({ 
        active: false, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { id, active: false };
  }

  static async findByName(name) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }
}

export default CategoryModel;
