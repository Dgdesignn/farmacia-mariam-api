
const express = require('express');
const ProductController = require('../controllers/productControllers');
const CategoryController = require('../controllers/categoryController');
const CustomerController = require('../controllers/customerController');
const AuthController = require('../controllers/authController');

const { productValidationRules, productUpdateValidationRules } = require('../validators/productValidator');
const { categoryValidationRules, categoryUpdateValidationRules } = require('../validators/categoryValidator');
const { customerValidationRules, customerUpdateValidationRules } = require('../validators/customerValidator');
const { loginValidationRules, registerValidationRules, changePasswordValidationRules, resetPasswordValidationRules } = require('../validators/authValidator');

const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Auth routes
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login do cliente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/auth/login', loginValidationRules(), AuthController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Cadastro de novo cliente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Cadastro realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos
 */
router.post('/auth/register', registerValidationRules(), AuthController.register);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obter perfil do cliente logado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *       401:
 *         description: Token inválido
 */
router.get('/auth/profile', authenticateToken, AuthController.profile);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Alterar senha do cliente
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Senha atual inválida
 *       401:
 *         description: Token inválido
 */
router.put('/auth/change-password', authenticateToken, changePasswordValidationRules(), AuthController.changePassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Resetar senha do cliente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nova senha enviada por email
 *       400:
 *         description: Email não encontrado
 */
router.post('/auth/reset-password', resetPasswordValidationRules(), AuthController.resetPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout do cliente
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token inválido
 */
router.post('/auth/logout', authenticateToken, AuthController.logout);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - categoryId
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         description:
 *           type: string
 *           description: Descrição do produto
 *         price:
 *           type: number
 *           description: Preço do produto
 *         stock:
 *           type: integer
 *           description: Quantidade em estoque
 *         barcode:
 *           type: string
 *           description: Código de barras
 *         categoryId:
 *           type: string
 *           description: ID da categoria
 *         active:
 *           type: boolean
 *           description: Status ativo/inativo
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da categoria
 *         name:
 *           type: string
 *           description: Nome da categoria
 *         description:
 *           type: string
 *           description: Descrição da categoria
 *         active:
 *           type: boolean
 *           description: Status ativo/inativo
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do cliente
 *         name:
 *           type: string
 *           description: Nome do cliente
 *         email:
 *           type: string
 *           description: Email do cliente
 *         phone:
 *           type: string
 *           description: Telefone do cliente
 *         cpf:
 *           type: string
 *           description: CPF do cliente
 *         address:
 *           type: string
 *           description: Endereço do cliente
 *         city:
 *           type: string
 *           description: Cidade
 *         state:
 *           type: string
 *           description: Estado
 *         zipCode:
 *           type: string
 *           description: CEP
 *         active:
 *           type: boolean
 *           description: Status ativo/inativo
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email do cliente
 *         password:
 *           type: string
 *           description: Senha do cliente
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do cliente
 *         email:
 *           type: string
 *           description: Email do cliente
 *         password:
 *           type: string
 *           description: Senha do cliente
 *         phone:
 *           type: string
 *           description: Telefone do cliente
 *         cpf:
 *           type: string
 *           description: CPF do cliente
 *         address:
 *           type: string
 *           description: Endereço do cliente
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Data de nascimento
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         token:
 *           type: string
 *           description: JWT token
 *         expiresIn:
 *           type: string
 *           description: Tempo de expiração do token
 */

// Product routes
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de itens por página
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome, descrição ou código de barras
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 */
router.get('/products', ProductController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obter produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/products/:id', ProductController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/products', productValidationRules(), ProductController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       404:
 *         description: Produto não encontrado
 */
router.put('/products/:id', productUpdateValidationRules(), ProductController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Excluir produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Produto excluído
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/products/:id', ProductController.delete);

/**
 * @swagger
 * /api/products/barcode/{barcode}:
 *   get:
 *     summary: Buscar produto por código de barras
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/products/barcode/:barcode', ProductController.getByBarcode);

// Category routes
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/categories', CategoryController.getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obter categoria por ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/categories/:id', CategoryController.getById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Categoria criada
 *       400:
 *         description: Dados inválidos
 */
router.post('/categories', categoryValidationRules(), CategoryController.create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 */
router.put('/categories/:id', categoryUpdateValidationRules(), CategoryController.update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Excluir categoria
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Categoria excluída
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/categories/:id', CategoryController.delete);

// Customer routes
/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Listar todos os clientes
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/customers', CustomerController.getAll);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Obter cliente por ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/customers/:id', CustomerController.getById);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Criar novo cliente
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Cliente criado
 *       400:
 *         description: Dados inválidos
 */
router.post('/customers', customerValidationRules(), CustomerController.create);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *       404:
 *         description: Cliente não encontrado
 */
router.put('/customers/:id', customerUpdateValidationRules(), CustomerController.update);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Excluir cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cliente excluído
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/customers/:id', CustomerController.delete);

module.exports = router;
