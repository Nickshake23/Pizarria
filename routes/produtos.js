const express = require("express");

const router = express.Router();

const autenticarToken =
    require("../middlewares/auth");

const permitirCargos =
    require("../middlewares/permissao");


const {

    listarProdutos,

    buscarProduto,

    cadastrarProduto,

    atualizarProduto,

    excluirProduto

} = require("../controllers/produtoController");


/*
=========================================
SWAGGER - TAGS E SCHEMAS
=========================================
*/

/**
 * @swagger
 * tags:
 *   - name: Produtos
 *     description: Gerenciamento dos produtos da pizzaria
 */


/**
 * @swagger
 * components:
 *
 *   schemas:
 *
 *     Produto:
 *       type: object
 *       properties:
 *
 *         _id:
 *           type: string
 *           example: 6a73861a90ab120ee5030b6c
 *
 *         nome:
 *           type: string
 *           example: Pizza Calabresa
 *
 *         descricao:
 *           type: string
 *           example: Pizza de calabresa com cebola e mussarela
 *
 *         imagem:
 *           type: string
 *           example: https://exemplo.com/pizza-calabresa.jpg
 *
 *         categoria:
 *           type: string
 *           enum:
 *             - Pizza
 *             - Bebida
 *             - Sobremesa
 *             - Porcao
 *           example: Pizza
 *
 *         preco:
 *           type: number
 *           minimum: 0
 *           example: 45
 *
 *         tamanho:
 *           type: string
 *           example: Grande
 *
 *         ingredientes:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - Calabresa
 *             - Cebola
 *             - Mussarela
 *
 *         disponivel:
 *           type: boolean
 *           example: true
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
 *     CadastroProduto:
 *       type: object
 *       required:
 *         - nome
 *         - categoria
 *         - preco
 *       properties:
 *
 *         nome:
 *           type: string
 *           example: Pizza Calabresa
 *
 *         descricao:
 *           type: string
 *           example: Pizza de calabresa com cebola e mussarela
 * 
 *         imagem:
 *           type: string
 *           example: https://exemplo.com/pizza-calabresa.jpg
 *
 *         categoria:
 *           type: string
 *           enum:
 *             - Pizza
 *             - Bebida
 *             - Sobremesa
 *             - Porcao
 *           example: Pizza
 *
 *         preco:
 *           type: number
 *           minimum: 0
 *           example: 45
 *
 *         tamanho:
 *           type: string
 *           example: Grande
 *
 *         ingredientes:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - Calabresa
 *             - Cebola
 *             - Mussarela
 *
 *         disponivel:
 *           type: boolean
 *           example: true
 *
 *
 *     AtualizarProduto:
 *       type: object
 *       properties:
 *
 *         nome:
 *           type: string
 *           example: Pizza Calabresa Especial
 *
 *         descricao:
 *           type: string
 *           example: Pizza de calabresa especial
 *
 *         imagem:
 *           type: string
 *           example: https://exemplo.com/pizza.jpg
 *
 *         categoria:
 *           type: string
 *           enum:
 *             - Pizza
 *             - Bebida
 *             - Sobremesa
 *             - Porcao
 *
 *         preco:
 *           type: number
 *           minimum: 0
 *           example: 49.9
 *
 *         tamanho:
 *           type: string
 *           example: Grande
 *
 *         ingredientes:
 *           type: array
 *           items:
 *             type: string
 *
 *         disponivel:
 *           type: boolean
 *           example: true
 */


/*
=========================================
TODAS AS ROTAS EXIGEM LOGIN
=========================================
*/

router.use(autenticarToken);


/*
=========================================
LISTAR PRODUTOS
=========================================
*/

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista os produtos
 *     description: Permite filtrar, paginar e ordenar os produtos cadastrados.
 *     tags:
 *       - Produtos
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
 *         description: Filtra produtos pelo nome
 *         example: Pizza
 *
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum:
 *             - Pizza
 *             - Bebida
 *             - Sobremesa
 *             - Porcao
 *         description: Filtra os produtos pela categoria
 *
 *       - in: query
 *         name: disponivel
 *         schema:
 *           type: boolean
 *         description: Filtra produtos pela disponibilidade
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
 *         description: Quantidade de produtos por página
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - nome
 *             - preco
 *             - categoria
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
 *         description: Produtos listados com sucesso
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
 *                   example: 7
 *
 *                 totalPaginas:
 *                   type: integer
 *                   example: 1
 *
 *                 quantidade:
 *                   type: integer
 *                   example: 7
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
 *                 produtos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 *
 *       400:
 *         description: Filtro, paginação ou ordenação inválida
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.get(
    "/",
    listarProdutos
);


/*
=========================================
BUSCAR PRODUTO POR ID
=========================================
*/

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags:
 *       - Produtos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *
 *       400:
 *         description: ID inválido
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       404:
 *         description: Produto não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.get(
    "/:id",
    buscarProduto
);


/*
=========================================
CADASTRAR PRODUTO
ADMINISTRADOR OU GERENTE
=========================================
*/

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cadastra um novo produto
 *     description: Somente Administradores e Gerentes podem cadastrar produtos.
 *     tags:
 *       - Produtos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroProduto'
 *
 *     responses:
 *
 *       201:
 *         description: Produto cadastrado com sucesso
 *
 *       400:
 *         description: Dados do produto inválidos
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       403:
 *         description: Usuário não possui permissão para cadastrar produtos
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.post(

    "/",

    permitirCargos(
        "Administrador",
        "Gerente"
    ),

    cadastrarProduto

);


/*
=========================================
ATUALIZAR PRODUTO
ADMINISTRADOR OU GERENTE
=========================================
*/

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     description: Somente Administradores e Gerentes podem atualizar produtos.
 *     tags:
 *       - Produtos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarProduto'
 *
 *     responses:
 *
 *       200:
 *         description: Produto atualizado com sucesso
 *
 *       400:
 *         description: Dados ou ID inválidos
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       403:
 *         description: Usuário não possui permissão para atualizar produtos
 *
 *       404:
 *         description: Produto não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.put(

    "/:id",

    permitirCargos(
        "Administrador",
        "Gerente"
    ),

    atualizarProduto

);


/*
=========================================
EXCLUIR PRODUTO
SOMENTE ADMINISTRADOR
=========================================
*/

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Exclui um produto
 *     description: Somente Administradores podem excluir produtos.
 *     tags:
 *       - Produtos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Produto removido com sucesso
 *
 *       400:
 *         description: ID inválido
 *
 *       401:
 *         description: Token não informado, inválido ou expirado
 *
 *       403:
 *         description: Usuário não possui permissão para excluir produtos
 *
 *       404:
 *         description: Produto não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */

router.delete(

    "/:id",

    permitirCargos(
        "Administrador"
    ),

    excluirProduto

);


module.exports = router;