
const { body } = require('express-validator');

const loginValidationRules = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email deve ter um formato válido'),
    
    body('password')
      .notEmpty()
      .withMessage('Senha é obrigatória')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres')
  ];
};

const registerValidationRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('email')
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email deve ter um formato válido'),
    
    body('password')
      .notEmpty()
      .withMessage('Senha é obrigatória')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
    
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
    
    body('birth_date')
      .optional()
      .isISO8601()
      .withMessage('Data de nascimento deve ter formato válido (YYYY-MM-DD)')
  ];
};

const changePasswordValidationRules = () => {
  return [
    body('oldPassword')
      .notEmpty()
      .withMessage('Senha atual é obrigatória'),
    
    body('newPassword')
      .notEmpty()
      .withMessage('Nova senha é obrigatória')
      .isLength({ min: 6 })
      .withMessage('Nova senha deve ter pelo menos 6 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Nova senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
  ];
};

const resetPasswordValidationRules = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email deve ter um formato válido')
  ];
};

module.exports = {
  loginValidationRules,
  registerValidationRules,
  changePasswordValidationRules,
  resetPasswordValidationRules
};
