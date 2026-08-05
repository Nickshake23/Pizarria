const express = require("express");
const router = express.Router();

const Produto = require("../models/Produto");
const autenticarToken = require("../middlewares/auth");

/*
=========================================
TODAS AS ROTAS ABAIXO EXIGEM LOGIN
=========================================
*/
router.use(autenticarToken);

/*
=========================================
LISTAR
=========================================
*/
router.get("/", async (req, res) => {

    try {

        const produtos = await Produto.find().sort({ nome: 1 });

        res.json(produtos);

    } catch (error) {

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

});

/*
=========================================
BUSCAR
=========================================
*/
router.get("/:id", async (req, res) => {

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

});

/*
=========================================
CADASTRAR
=========================================
*/
router.post("/", async (req, res) => {

    try {

        const produto = new Produto(req.body);

        await produto.save();

        res.status(201).json({

            sucesso: true,
            mensagem: "Produto cadastrado.",
            produto

        });

    } catch (error) {

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

});

/*
=========================================
ATUALIZAR
=========================================
*/
router.put("/:id", async (req, res) => {

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

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

});

/*
=========================================
EXCLUIR
=========================================
*/
router.delete("/:id", async (req, res) => {

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

});

module.exports = router;