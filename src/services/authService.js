
import AuthModel from '../models/authModel.js';
const jwt = require('jsonwebtoken');

class AuthService {
  static generateToken(customer) {
    const payload = {
      id: customer.id,
      email: customer.email,
      name: customer.name
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'seu_jwt_secret_default',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  static async login(email, password) {
    const customer = await AuthModel.login(email, password);
    const token = this.generateToken(customer);
    
    return {
      customer,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };
  }

  static async register(userData) {
    const customer = await AuthModel.register(userData);
    const token = this.generateToken(customer);
    
    return {
      customer,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };
  }

  static async changePassword(customerId, oldPassword, newPassword) {
    return await AuthModel.changePassword(customerId, oldPassword, newPassword);
  }

  static async resetPassword(email) {
    return await AuthModel.resetPassword(email);
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret_default');
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

export default AuthService;
