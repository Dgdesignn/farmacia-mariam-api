
import { body } from 'express-validator';

const productValidationRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 200 })
      .withMessage('Nome deve ter entre 2 e 200 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Descrição deve ter no máximo 1000 caracteres'),
    
    body('price')
      .notEmpty()
      .withMessage('Preço é obrigatório')
      .isFloat({ min: 0 })
      .withMessage('Preço deve ser um número positivo'),
    
    body('stock_quantity')
      .notEmpty()
      .withMessage('Quantidade em estoque é obrigatória')
      .isInt({ min: 0 })
      .withMessage('Quantidade em estoque deve ser um número inteiro positivo'),
    
    body('categoryId')
      .notEmpty()
      .withMessage('Categoria é obrigatória')
      .isUUID()
      .withMessage('ID da categoria deve ser um UUID válido'),
    
    body('barcode')
      .optional()
      .isLength({ min: 8, max: 20 })
      .withMessage('Código de barras deve ter entre 8 e 20 caracteres'),
    
    body('manufacturer')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Fabricante deve ter no máximo 100 caracteres'),
    
    body('expiry_date')
      .optional()
      .isISO8601()
      .withMessage('Data de validade deve ter formato válido (YYYY-MM-DD)'),
    
    body('prescription_required')
      .optional()
      .isBoolean()
      .withMessage('Prescrição necessária deve ser verdadeiro ou falso')
  ];
};

const productUpdateValidationRules = () => {
  return [
    body('name')
      .optional()
      .isLength({ min: 2, max: 200 })
      .withMessage('Nome deve ter entre 2 e 200 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Descrição deve ter no máximo 1000 caracteres'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Preço deve ser um número positivo'),
    
    body('stock_quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantidade em estoque deve ser um número inteiro positivo'),
    
    body('categoryId')
      .optional()
      .isUUID()
      .withMessage('ID da categoria deve ser um UUID válido'),
    
    body('barcode')
      .optional()
      .isLength({ min: 8, max: 20 })
      .withMessage('Código de barras deve ter entre 8 e 20 caracteres'),
    
    body('manufacturer')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Fabricante deve ter no máximo 100 caracteres'),
    
    body('expiry_date')
      .optional()
      .isISO8601()
      .withMessage('Data de validade deve ter formato válido (YYYY-MM-DD)'),
    
    body('prescription_required')
      .optional()
      .isBoolean()
      .withMessage('Prescrição necessária deve ser verdadeiro ou falso')
  ];
};

export {
  productValidationRules,
  productUpdateValidationRules
};
