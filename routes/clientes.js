const express = require("express");

const router = express.Router();

const autenticarToken =
    require("../middlewares/auth");

const permitirCargos =
    require("../middlewares/permissao");


const {

    listarClientes,

    buscarCliente,

    cadastrarCliente,

    atualizarCliente,

    excluirCliente

} = require("../controllers/clienteController");


/*
=========================================
SWAGGER - TAGS E SCHEMAS
=========================================
*/

/**
 * @swagger
 * tags:
 *   - name: Clientes
 *     description: Gerenciamento dos clientes da pizzaria
 */


/**
 * @swagger
 * components:
 *
 *   schemas:
 *
 *     EnderecoCliente:
 *       type: object
 *       properties:
 *
 *         rua:
 *           type: string
 *           example: Rua das Flores
 *
 *         numero:
 *           type: number
 *           example: 150
 *
 *         bairro:
 *           type: string
 *           example: Centro
 *
 *         cidade:
 *           type: string
 *           example: São Paulo
 *
 *         cep:
 *           type: string
 *           example: "00000-000"
 *
 *
 *     Cliente:
 *       type: object
 *       properties:
 *
 *         _id:
 *           type: string
 *           example: 6a7385f190ab120ee5030b66
 *
 *         nome:
 *           type: string
 *           example: João Silva
 *
 *         telefone:
 *           type: string
 *           example: "(11) 99999-9999"
 *
 *         email:
 *           type: string
 *           example: joao@email.com
 *
 *         endereco:
 *           $ref: '#/components/schemas/EnderecoCliente'
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *
 *     CadastroCliente:
 *       type: object
 *       required:
 *         - nome
 *         - telefone
 *       properties:
 *
 *         nome:
 *           type: string
 *           example: João Silva
 *
 *         telefone:
 *           type: string
 *           example: "(11) 99999-9999"
 *
 *         email:
 *           type: string
 *           example: joao@email.com
 *
 *         endereco:
 *           $ref: '#/components/schemas/EnderecoCliente'
 *
 *
 *     AtualizarCliente:
 *       type: object
 *       properties:
 *
 *         nome:
 *           type: string
 *           example: João Silva Atualizado
 *
 *         telefone:
 *           type: string
 *           example: "(11) 98888-8888"
 *
 *         email:
 *           type: string
 *           example: joao.novo@email.com
 *
 *         endereco:
 *           $ref: '#/components/schemas/EnderecoCliente'
 */


/*
=========================================
TODAS AS ROTAS EXIGEM LOGIN
=========================================
*/

router.use(autenticarToken);


/*
=========================================
LISTAR CLIENTES
=========================================
*/

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista os clientes
 *     description: Permite filtrar, paginar e ordenar os clientes cadastrados.
 *     tags:
 *       - Clientes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtra clientes pelo nome
 *         example: João
 *
 *       - in: query
 *         name: telefone
 *         schema:
 *           type: string
 *         description: Filtra clientes pelo telefone
 *         example: "99999"
 *
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtra clientes pelo e-mail
 *         example: joao@email.com
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Quantidade de clientes por página
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - nome
 *             - telefone
 *             - email
 *           default: nome
 *         description: Campo utilizado para ordenação
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: asc
 *         description: Direção da ordenação
 *
 *     responses:
 *
 *       200:
 *         description: Clientes listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *
 *                 pagina:
 *                   type: integer
 *                   example: 1
 *
 *                 limite:
 *                   type: integer
 *                   example: 10
 *
 *                 total:
 *                   type: integer
 *                   example: 20
 *
 *                 totalPaginas:
 *                   type: integer
 *                   example: 2
 *
 *                 quantidade:
 *                   type: integer
 *                   example: 10
 *
 *                 ordenacao:
 *                   type: object
 *                   properties:
 *
 *                     campo:
 *                       type: string
 *                       example: nome
 *
 *                     ordem:
 *                       type: string
 *                       example: asc
 *
 *                 clientes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cliente'
 *
 *       400:
 *         description: Paginação ou ordenação inválida
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.get(
    "/",
    listarClientes
);


/*
=========================================
BUSCAR CLIENTE POR ID
=========================================
*/

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Busca um cliente pelo ID
 *     tags:
 *       - Clientes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *
 *       400:
 *         description: ID inválido
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       404:
 *         description: Cliente não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.get(
    "/:id",
    buscarCliente
);


/*
=========================================
CADASTRAR CLIENTE
=========================================
*/

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cadastra um novo cliente
 *     description: Qualquer usuário autenticado pode cadastrar clientes.
 *     tags:
 *       - Clientes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroCliente'
 *
 *     responses:
 *
 *       201:
 *         description: Cliente cadastrado com sucesso
 *
 *       400:
 *         description: Dados obrigatórios ausentes ou telefone já cadastrado
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.post(
    "/",
    cadastrarCliente
);


/*
=========================================
ATUALIZAR CLIENTE
=========================================
*/

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     description: Qualquer usuário autenticado pode atualizar clientes.
 *     tags:
 *       - Clientes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarCliente'
 *
 *     responses:
 *
 *       200:
 *         description: Cliente atualizado com sucesso
 *
 *       400:
 *         description: Dados ou ID inválidos
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       404:
 *         description: Cliente não encontrado
 *
 *       409:
 *         description: Informação única já cadastrada
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.put(
    "/:id",
    atualizarCliente
);


/*
=========================================
EXCLUIR CLIENTE
ADMINISTRADOR OU GERENTE
=========================================
*/

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Exclui um cliente
 *     description: Somente Administradores e Gerentes podem excluir clientes.
 *     tags:
 *       - Clientes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Cliente removido com sucesso
 *
 *       400:
 *         description: ID inválido
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       403:
 *         description: Usuário não possui permissão para excluir clientes
 *
 *       404:
 *         description: Cliente não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.delete(

    "/:id",

    permitirCargos(
        "Administrador",
        "Gerente"
    ),

    excluirCliente

);


module.exports = router;