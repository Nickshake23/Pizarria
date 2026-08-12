const Produto = require("../models/Produto");

/*
=========================================
LISTAR PRODUTOS
=========================================
*/

const listarProdutos = async (req, res) => {

    try {

        const {
            nome,
            categoria,
            disponivel
        } = req.query;


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
        BUSCAR PRODUTOS
        =========================================
        */

        const produtos = await Produto.find(filtros)
            .sort({ nome: 1 });


        /*
        =========================================
        RESPOSTA
        =========================================
        */

        res.status(200).json({

            sucesso: true,

            quantidade: produtos.length,

            produtos

        });


    } catch (error) {

        res.status(500).json({

            sucesso: false,

            mensagem: "Erro ao buscar produtos.",

            erro: error.message

        });

    }

};


/*
=========================================
BUSCAR POR ID
=========================================
*/

const buscarProduto = async (req, res) => {

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

        res.status(500).json({

            sucesso: false,
            mensagem: "Erro ao buscar produto.",
            erro: error.message

        });

    }

};


/*
=========================================
CADASTRAR PRODUTO
=========================================
*/

const cadastrarProduto = async (req, res) => {

    try {

        const {
            nome,
            descricao,
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


        /*
        =========================================
        ERRO INTERNO
        =========================================
        */

        return res.status(500).json({

            sucesso: false,

            mensagem: "Erro ao cadastrar produto.",

            erro: error.message

        });

    }

};


/*
=========================================
ATUALIZAR
=========================================
*/

const atualizarProduto = async (req, res) => {

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

        res.status(500).json({

            sucesso: false,

            mensagem: "Erro ao atualizar produto.",

            erro: error.message

        });

    }

};


/*
=========================================
EXCLUIR
=========================================
*/

const excluirProduto = async (req, res) => {

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

        res.status(500).json({

            sucesso: false,

            mensagem: "Erro ao remover produto.",

            erro: error.message

        });

    }

};


module.exports = {

    listarProdutos,

    buscarProduto,

    cadastrarProduto,

    atualizarProduto,

    excluirProduto

};