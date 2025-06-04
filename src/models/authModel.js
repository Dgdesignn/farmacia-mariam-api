
import { supabase } from '../config/config.js';
import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');

class AuthModel {
  static async login(email, password) {
    try {
      // Buscar customer pelo email
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .eq('active', true)
        .single();

      if (error || !customer) {
        throw new Error('Email ou senha inválidos');
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, customer.password);
      if (!isValidPassword) {
        throw new Error('Email ou senha inválidos');
      }

      // Remover senha dos dados retornados
      const { password: _, ...customerData } = customer;
      return customerData;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async register(userData) {
    try {
      // Verificar se email já existe
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingCustomer) {
        throw new Error('Email já cadastrado');
      }

      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Criar customer
      const { data: customer, error } = await supabase
        .from('customers')
        .insert([{
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          phone: userData.phone,
          cpf: userData.cpf,
          address: userData.address,
          birth_date: userData.birth_date
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Remover senha dos dados retornados
      const { password: _, ...customerData } = customer;
      return customerData;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async changePassword(customerId, oldPassword, newPassword) {
    try {
      // Buscar customer
      const { data: customer, error } = await supabase
        .from('customers')
        .select('password')
        .eq('id', customerId)
        .eq('active', true)
        .single();

      if (error || !customer) {
        throw new Error('Cliente não encontrado');
      }

      // Verificar senha atual
      const isValidPassword = await bcrypt.compare(oldPassword, customer.password);
      if (!isValidPassword) {
        throw new Error('Senha atual inválida');
      }

      // Hash da nova senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Atualizar senha
      const { error: updateError } = await supabase
        .from('customers')
        .update({ 
          password: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId);

      if (updateError) throw new Error(updateError.message);

      return { message: 'Senha alterada com sucesso' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async resetPassword(email) {
    try {
      // Verificar se customer existe
      const { data: customer, error } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .eq('active', true)
        .single();

      if (error || !customer) {
        throw new Error('Email não encontrado');
      }

      // Gerar nova senha temporária
      const tempPassword = Math.random().toString(36).slice(-8);
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

      // Atualizar senha
      const { error: updateError } = await supabase
        .from('customers')
        .update({ 
          password: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id);

      if (updateError) throw new Error(updateError.message);

      // Em um sistema real, você enviaria essa senha por email
      console.log(`Nova senha temporária para ${email}: ${tempPassword}`);

      return { 
        message: 'Nova senha enviada por email',
        tempPassword // Remove em produção
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default AuthModel;
