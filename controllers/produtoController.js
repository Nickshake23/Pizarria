const Produto = require("../models/Produto");

/*
=========================================
LISTAR PRODUTOS
=========================================
*/
const listarProdutos = async (req, res) => {

    try {

        const produtos = await Produto.find().sort({ nome: 1 });

        res.status(200).json(produtos);

    } catch (error) {

        res.status(500).json({
            sucesso: false,
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

        res.json(produto);

    } catch (error) {

        res.status(500).json({
            sucesso: false,
            erro: error.message
        });

    }

};

/*
=========================================
CADASTRAR
=========================================
*/
const cadastrarProduto = async (req, res) => {

    try {

        const produto = new Produto(req.body);

        await produto.save();

        res.status(201).json({
            sucesso: true,
            mensagem: "Produto cadastrado.",
            produto
        });

    } catch (error) {

    if (error.name === "ValidationError") {

        return res.status(400).json({

            sucesso: false,
            mensagem: "Categoria inválida. Utilize apenas: Pizza, Bebida, Sobremesa ou Porcao."

        });

    }

    res.status(500).json({

        sucesso: false,
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

        res.json({
            sucesso: true,
            mensagem: "Produto atualizado.",
            produto
        });

    } catch (error) {

    if (error.name === "ValidationError") {

        return res.status(400).json({

            sucesso: false,
            mensagem: "Categoria inválida. Utilize apenas: Pizza, Bebida, Sobremesa ou Porcao."

        });

    }

    res.status(500).json({

        sucesso: false,
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

        const produto = await Produto.findByIdAndDelete(req.params.id);

        if (!produto) {

            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            });

        }

        res.json({
            sucesso: true,
            mensagem: "Produto removido."
        });

    } catch (error) {

        res.status(500).json({
            sucesso: false,
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