
const CustomerModel = require('../models/customerModel');

class CustomerService {
  static async getAllCustomers(page, limit, search) {
    return await CustomerModel.findAll(page, limit, search);
  }

  static async getCustomerById(id) {
    const customer = await CustomerModel.findById(id);
    if (!customer || !customer.active) {
      throw new Error('Cliente não encontrado');
    }
    return customer;
  }

  static async createCustomer(data) {
    // Verificar se o email já existe
    if (data.email) {
      const existingCustomer = await CustomerModel.findByEmail(data.email);
      if (existingCustomer) {
        throw new Error('Email já cadastrado');
      }
    }

    // Verificar se o CPF já existe
    if (data.cpf) {
      const existingCustomer = await CustomerModel.findByCpf(data.cpf);
      if (existingCustomer) {
        throw new Error('CPF já cadastrado');
      }
    }

    return await CustomerModel.create(data);
  }

  static async updateCustomer(id, data) {
    const customer = await CustomerModel.findById(id);
    if (!customer || !customer.active) {
      throw new Error('Cliente não encontrado');
    }

    // Verificar email se fornecido
    if (data.email && data.email !== customer.email) {
      const existingCustomer = await CustomerModel.findByEmail(data.email);
      if (existingCustomer) {
        throw new Error('Email já cadastrado');
      }
    }

    // Verificar CPF se fornecido
    if (data.cpf && data.cpf !== customer.cpf) {
      const existingCustomer = await CustomerModel.findByCpf(data.cpf);
      if (existingCustomer) {
        throw new Error('CPF já cadastrado');
      }
    }

    return await CustomerModel.update(id, data);
  }

  static async deleteCustomer(id) {
    const customer = await CustomerModel.findById(id);
    if (!customer || !customer.active) {
      throw new Error('Cliente não encontrado');
    }

    return await CustomerModel.delete(id);
  }
}

module.exports = CustomerService;
