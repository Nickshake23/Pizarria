const express = require("express");
const router = express.Router();

const autenticarToken = require("../middlewares/auth");
const permitirCargos = require("../middlewares/permissao");

const {

    listarUsuarios,
    buscarUsuario,
    cadastrarUsuario,
    login,
    atualizarUsuario,
    excluirUsuario

} = require("../controllers/usuarioController");


/*
=========================================
SWAGGER - TAGS E SCHEMAS
=========================================
*/

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Autenticação e gerenciamento de usuários
 */


/**
 * @swagger
 * components:
 *   schemas:
 *
 *     LoginUsuario:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@email.com
 *         senha:
 *           type: string
 *           example: "123456"
 *
 *
 *     CadastroUsuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           example: joao@email.com
 *         senha:
 *           type: string
 *           minLength: 6
 *           example: "123456"
 *         cargo:
 *           type: string
 *           enum:
 *             - Administrador
 *             - Gerente
 *             - Atendente
 *           example: Atendente
 *
 *
 *     AtualizarUsuario:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           example: joao@email.com
 *         senha:
 *           type: string
 *           minLength: 6
 *           example: "654321"
 *         cargo:
 *           type: string
 *           enum:
 *             - Administrador
 *             - Gerente
 *             - Atendente
 *           example: Gerente
 *         ativo:
 *           type: boolean
 *           example: true
 */


/*
=========================================
LOGIN
=========================================
*/

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags:
 *       - Usuários
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUsuario'
 *
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *
 *       401:
 *         description: E-mail ou senha inválidos
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.post("/login", login);


/*
=========================================
TODAS AS ROTAS ABAIXO EXIGEM LOGIN
=========================================
*/

router.use(autenticarToken);


/*
=========================================
LISTAR USUÁRIOS
=========================================
*/

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - Usuários
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Usuários listados com sucesso
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.get("/", listarUsuarios);


/*
=========================================
BUSCAR USUÁRIO POR ID
=========================================
*/

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags:
 *       - Usuários
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *
 *       400:
 *         description: ID inválido
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       404:
 *         description: Usuário não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.get("/:id", buscarUsuario);


/*
=========================================
CADASTRAR USUÁRIO
SOMENTE ADMINISTRADOR
=========================================
*/

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     description: Somente usuários com cargo Administrador podem cadastrar usuários.
 *     tags:
 *       - Usuários
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroUsuario'
 *
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *
 *       400:
 *         description: Dados inválidos ou e-mail já cadastrado
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       403:
 *         description: Usuário não possui permissão
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.post(
    "/",
    permitirCargos("Administrador"),
    cadastrarUsuario
);


/*
=========================================
ATUALIZAR USUÁRIO
SOMENTE ADMINISTRADOR
=========================================
*/

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     description: Somente usuários com cargo Administrador podem atualizar usuários.
 *     tags:
 *       - Usuários
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarUsuario'
 *
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *
 *       400:
 *         description: Dados ou ID inválidos
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       403:
 *         description: Usuário não possui permissão
 *
 *       404:
 *         description: Usuário não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.put(
    "/:id",
    permitirCargos("Administrador"),
    atualizarUsuario
);


/*
=========================================
EXCLUIR USUÁRIO
SOMENTE ADMINISTRADOR
=========================================
*/

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     description: Somente usuários com cargo Administrador podem excluir usuários.
 *     tags:
 *       - Usuários
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *
 *       400:
 *         description: ID inválido
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       403:
 *         description: Usuário não possui permissão
 *
 *       404:
 *         description: Usuário não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.delete(
    "/:id",
    permitirCargos("Administrador"),
    excluirUsuario
);


module.exports = router;