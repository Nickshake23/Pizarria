const express = require("express");

const router = express.Router();

const autenticarToken = require("../middlewares/auth");

const {

    listarPedidos,

    buscarPedido,

    cadastrarPedido,

    atualizarStatusPedido,

    excluirPedido

} = require("../controllers/pedidoController");

router.use(autenticarToken);

router.get("/", listarPedidos);

router.get("/:id", buscarPedido);

router.post("/", cadastrarPedido);

router.put("/:id/status", atualizarStatusPedido);

router.delete("/:id", excluirPedido);

module.exports = router;