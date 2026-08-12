const express = require("express");

const router = express.Router();

const autenticarToken = require("../middlewares/auth");
const permitirCargos = require("../middlewares/permissao");

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

router.put(
    "/:id/status",
    permitirCargos("Administrador", "Gerente", "Atendente"),
    atualizarStatusPedido
);

router.delete(
    "/:id",
    permitirCargos("Administrador", "Gerente"),
    excluirPedido
);

module.exports = router;