const express = require("express");
const router = express.Router();

const autenticarToken = require("../middlewares/auth");
const permitirCargos = require("../middlewares/permissao");

const {

    listarProdutos,
    buscarProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto

} = require("../controllers/produtoController");

router.use(autenticarToken);

router.get("/", listarProdutos);

router.get("/:id", buscarProduto);

router.post(
    "/",
    permitirCargos("Administrador", "Gerente"),
    cadastrarProduto
);

router.put(
    "/:id",
    permitirCargos("Administrador", "Gerente"),
    atualizarProduto
);

router.delete(
    "/:id",
    permitirCargos("Administrador"),
    excluirProduto
);

module.exports = router;