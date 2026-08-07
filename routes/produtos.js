const express = require("express");
const router = express.Router();

const autenticarToken = require("../middlewares/auth");

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

router.post("/", cadastrarProduto);

router.put("/:id", atualizarProduto);

router.delete("/:id", excluirProduto);

module.exports = router;