
const { body } = require('express-validator');

const productValidationRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Descrição deve ter no máximo 500 caracteres'),
    
    body('price')
      .isNumeric()
      .withMessage('Preço deve ser um número')
      .isFloat({ min: 0.01 })
      .withMessage('Preço deve ser maior que 0'),
    
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Estoque deve ser um número inteiro não negativo'),
    
    body('categoryId')
      .notEmpty()
      .withMessage('Categoria é obrigatória'),
    
    body('barcode')
      .optional()
      .isLength({ min: 8, max: 20 })
      .withMessage('Código de barras deve ter entre 8 e 20 caracteres')
  ];
};

const productUpdateValidationRules = () => {
  return [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Descrição deve ter no máximo 500 caracteres'),
    
    body('price')
      .optional()
      .isNumeric()
      .withMessage('Preço deve ser um número')
      .isFloat({ min: 0.01 })
      .withMessage('Preço deve ser maior que 0'),
    
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Estoque deve ser um número inteiro não negativo'),
    
    body('categoryId')
      .optional()
      .notEmpty()
      .withMessage('Categoria não pode estar vazia'),
    
    body('barcode')
      .optional()
      .isLength({ min: 8, max: 20 })
      .withMessage('Código de barras deve ter entre 8 e 20 caracteres')
  ];
};

module.exports = {
  productValidationRules,
  productUpdateValidationRules
};
