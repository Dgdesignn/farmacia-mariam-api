
const { body } = require('express-validator');

const categoryValidationRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 50 })
      .withMessage('Nome deve ter entre 2 e 50 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Descrição deve ter no máximo 200 caracteres')
  ];
};

const categoryUpdateValidationRules = () => {
  return [
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Nome deve ter entre 2 e 50 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Descrição deve ter no máximo 200 caracteres')
  ];
};

module.exports = {
  categoryValidationRules,
  categoryUpdateValidationRules
};
