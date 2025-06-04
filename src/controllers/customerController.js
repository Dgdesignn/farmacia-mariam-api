
import CustomerService from '../services/customerService.js';
import { validationResult } from 'express-validator';

class CustomerController {
  static async getAllCustomers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || null;

      const result = await CustomerService.getAllCustomers(page, limit, search);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await CustomerService.getCustomerById(id);
      res.json(customer);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async createCustomer(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const customer = await CustomerService.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateCustomer(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const customer = await CustomerService.updateCustomer(id, req.body);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const result = await CustomerService.deleteCustomer(id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default CustomerController;
