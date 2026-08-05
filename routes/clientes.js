const express = require("express");
const router = express.Router();

const autenticarToken = require("../middlewares/auth");

const {
    listarClientes,
    buscarCliente,
    cadastrarCliente,
    atualizarCliente,
    excluirCliente
} = require("../controllers/clienteController");

router.use(autenticarToken);

router.get("/", listarClientes);

router.get("/:id", buscarCliente);

router.post("/", cadastrarCliente);

router.put("/:id", atualizarCliente);

router.delete("/:id", excluirCliente);

module.exports = router;