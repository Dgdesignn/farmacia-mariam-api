
import { body } from 'express-validator';

const categoryValidationRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Descrição deve ter no máximo 500 caracteres')
  ];
};

const categoryUpdateValidationRules = () => {
  return [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Descrição deve ter no máximo 500 caracteres')
  ];
};

export {
  categoryValidationRules,
  categoryUpdateValidationRules
};
