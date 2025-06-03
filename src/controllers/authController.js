
const { validationResult } = require('express-validator');
const AuthService = require('../services/authService');

class AuthController {
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      res.json({
        message: 'Login realizado com sucesso',
        ...result
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await AuthService.register(req.body);
      
      res.status(201).json({
        message: 'Cadastro realizado com sucesso',
        ...result
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { oldPassword, newPassword } = req.body;
      const customerId = req.user.id; // Vem do middleware de autenticação

      const result = await AuthService.changePassword(customerId, oldPassword, newPassword);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      const result = await AuthService.resetPassword(email);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async profile(req, res) {
    try {
      // Retorna os dados do usuário logado
      res.json({
        customer: req.user
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      // Em um sistema com blacklist de tokens, adicionaria o token à blacklist
      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
