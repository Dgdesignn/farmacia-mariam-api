
const { body } = require('express-validator');

const customerValidationRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email deve ter um formato válido'),
    
    body('phone')
      .optional()
      .isMobilePhone('pt-BR')
      .withMessage('Telefone deve ter um formato válido'),
    
    body('cpf')
      .optional()
      .isLength({ min: 11, max: 14 })
      .withMessage('CPF deve ter formato válido'),
    
    body('address')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Endereço deve ter no máximo 200 caracteres'),
    
    body('city')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Cidade deve ter no máximo 50 caracteres'),
    
    body('state')
      .optional()
      .isLength({ min: 2, max: 2 })
      .withMessage('Estado deve ter 2 caracteres'),
    
    body('zipCode')
      .optional()
      .matches(/^\d{5}-?\d{3}$/)
      .withMessage('CEP deve ter formato válido')
  ];
};

const customerUpdateValidationRules = () => {
  return [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email deve ter um formato válido'),
    
    body('phone')
      .optional()
      .isMobilePhone('pt-BR')
      .withMessage('Telefone deve ter um formato válido'),
    
    body('cpf')
      .optional()
      .isLength({ min: 11, max: 14 })
      .withMessage('CPF deve ter formato válido'),
    
    body('address')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Endereço deve ter no máximo 200 caracteres'),
    
    body('city')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Cidade deve ter no máximo 50 caracteres'),
    
    body('state')
      .optional()
      .isLength({ min: 2, max: 2 })
      .withMessage('Estado deve ter 2 caracteres'),
    
    body('zipCode')
      .optional()
      .matches(/^\d{5}-?\d{3}$/)
      .withMessage('CEP deve ter formato válido')
  ];
};

module.exports = {
  customerValidationRules,
  customerUpdateValidationRules
};
