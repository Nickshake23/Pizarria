const Produto = require("../models/Produto");

/*
=========================================
LISTAR PRODUTOS COM PAGINAÇÃO E ORDENAÇÃO
=========================================
*/
const listarProdutos = async (req, res, next) => {

    try {

        const {
            nome,
            categoria,
            disponivel,
            page = 1,
            limit = 10,
            sort = "nome",
            order = "asc"
        } = req.query;


        /*
        =========================================
        VALIDAR PAGINAÇÃO
        =========================================
        */

        const pagina = Number(page);
        const limite = Number(limit);


        if (
            !Number.isInteger(pagina) ||
            pagina < 1
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "A página deve ser um número inteiro maior que 0."

            });

        }


        if (
            !Number.isInteger(limite) ||
            limite < 1 ||
            limite > 100
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "O limite deve ser um número entre 1 e 100."

            });

        }


        /*
        =========================================
        VALIDAR ORDENAÇÃO
        =========================================
        */

        const camposPermitidos = [
            "nome",
            "preco",
            "categoria"
        ];


        if (!camposPermitidos.includes(sort)) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "Campo de ordenação inválido."

            });

        }


        if (
            order !== "asc" &&
            order !== "desc"
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "A ordem deve ser asc ou desc."

            });

        }


        /*
        =========================================
        MONTAR FILTROS
        =========================================
        */

        const filtros = {};


        /*
        =========================================
        BUSCAR POR NOME
        =========================================
        */

        if (nome) {

            filtros.nome = {

                $regex: nome,

                $options: "i"

            };

        }


        /*
        =========================================
        FILTRAR POR CATEGORIA
        =========================================
        */

        if (categoria) {

            filtros.categoria = categoria;

        }


        /*
        =========================================
        FILTRAR POR DISPONIBILIDADE
        =========================================
        */

        if (disponivel !== undefined) {

            if (
                disponivel !== "true" &&
                disponivel !== "false"
            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem: "O campo disponivel deve ser true ou false."

                });

            }

            filtros.disponivel = disponivel === "true";

        }


        /*
        =========================================
        CALCULAR PAGINAÇÃO
        =========================================
        */

        const pular = (pagina - 1) * limite;


        /*
        =========================================
        DEFINIR ORDENAÇÃO
        =========================================
        */

        const ordem = {

            [sort]: order === "asc" ? 1 : -1

        };


        /*
        =========================================
        BUSCAR PRODUTOS
        =========================================
        */

        const produtos = await Produto.find(filtros)

            .sort(ordem)

            .skip(pular)

            .limit(limite);


        /*
        =========================================
        CONTAR TOTAL
        =========================================
        */

        const total = await Produto.countDocuments(filtros);


        const totalPaginas = Math.ceil(
            total / limite
        );


        /*
        =========================================
        RESPOSTA
        =========================================
        */

        res.status(200).json({

            sucesso: true,

            pagina,

            limite,

            total,

            totalPaginas,

            quantidade: produtos.length,

            ordenacao: {

                campo: sort,

                ordem: order

            },

            produtos

        });

    } catch (error) {

        next(error);

    }

};


/*
=========================================
BUSCAR POR ID
=========================================
*/

const buscarProduto = async (req, res, next) => {

    try {

        const produto = await Produto.findById(req.params.id);

        if (!produto) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Produto não encontrado."

            });

        }

        res.status(200).json(produto);

    } catch (error) {

    next(error);

}

};


/*
=========================================
CADASTRAR PRODUTO
=========================================
*/

const cadastrarProduto = async (req, res, next) => {

    try {

        const {
            nome,
            descricao,
            imagem,
            categoria,
            preco,
            tamanho,
            ingredientes,
            disponivel
        } = req.body;


        /*
        =========================================
        VALIDAR NOME
        =========================================
        */

        if (!nome || !nome.trim()) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "O nome do produto é obrigatório."

            });

        }


        /*
        =========================================
        VALIDAR CATEGORIA
        =========================================
        */

        if (!categoria || !categoria.trim()) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "A categoria do produto é obrigatória."

            });

        }


        /*
        =========================================
        VALIDAR PREÇO
        =========================================
        */

        if (preco === undefined || preco === null) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "O preço do produto é obrigatório."

            });

        }


        if (
            typeof preco !== "number" ||
            !Number.isFinite(preco)
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "O preço deve ser um número válido."

            });

        }


        if (preco < 0) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "O preço não pode ser negativo."

            });

        }


        /*
        =========================================
        VALIDAR INGREDIENTES
        =========================================
        */

        if (
            ingredientes !== undefined &&
            !Array.isArray(ingredientes)
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "Os ingredientes devem ser enviados em formato de lista."

            });

        }


        /*
        =========================================
        VALIDAR DISPONIBILIDADE
        =========================================
        */

        if (
            disponivel !== undefined &&
            typeof disponivel !== "boolean"
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "O campo disponivel deve ser verdadeiro ou falso."

            });

        }


        /*
        =========================================
        CRIAR PRODUTO
        =========================================
        */

        const produto = new Produto({

            nome: nome.trim(),

            descricao: descricao || "",

            imagem: imagem || "",

            categoria: categoria.trim(),

            preco,

            tamanho: tamanho || "",

            ingredientes: ingredientes || [],

            disponivel:
                disponivel !== undefined
                    ? disponivel
                    : true

        });


        /*
        =========================================
        SALVAR
        =========================================
        */

        await produto.save();


        /*
        =========================================
        RESPOSTA
        =========================================
        */

        return res.status(201).json({

            sucesso: true,

            mensagem: "Produto cadastrado com sucesso.",

            produto

        });

    } catch (error) {

        /*
        =========================================
        ERRO DE VALIDAÇÃO DO MONGOOSE
        =========================================
        */

        if (error.name === "ValidationError") {

            return res.status(400).json({

                sucesso: false,

                mensagem: "Dados do produto inválidos.",

                erro: error.message

            });

        }

       next(error);

    }

};


/*
=========================================
ATUALIZAR
=========================================
*/

const atualizarProduto = async (req, res,next) => {

    try {

        const produto = await Produto.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!produto) {

            return res.status(404).json({

                sucesso: false,

                mensagem: "Produto não encontrado."

            });

        }

        res.status(200).json({

            sucesso: true,

            mensagem: "Produto atualizado com sucesso.",

            produto

        });

    } catch (error) {

        if (error.name === "ValidationError") {

            return res.status(400).json({

                sucesso: false,

                mensagem: "Dados inválidos para atualização do produto.",

                erro: error.message
                
            });

        }

        next(error);

    }

};


/*
=========================================
EXCLUIR
=========================================
*/

const excluirProduto = async (req, res, next) => {

    try {

        const produto = await Produto.findByIdAndDelete(
            req.params.id
        );

        if (!produto) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Produto não encontrado."

            });

        }

        res.status(200).json({

            sucesso: true,

            mensagem: "Produto removido com sucesso."

        });

    } catch (error) {

    next(error);

}

};


module.exports = {

    listarProdutos,

    buscarProduto,

    cadastrarProduto,

    atualizarProduto,

    excluirProduto

};