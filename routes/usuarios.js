const express = require("express");
const router = express.Router();

const autenticarToken = require("../middlewares/auth");
const permitirCargos = require("../middlewares/permissao");

const {

    listarUsuarios,
    buscarUsuario,
    cadastrarUsuario,
    login,
    atualizarUsuario,
    excluirUsuario

} = require("../controllers/usuarioController");

/*
=========================================
LOGIN
=========================================
*/
router.post("/login", login);

/*
=========================================
TODAS AS ROTAS ABAIXO EXIGEM LOGIN
=========================================
*/
router.use(autenticarToken);

/*
=========================================
ROTAS
=========================================
*/
router.get("/", listarUsuarios);

router.get("/:id", buscarUsuario);

router.post(
    "/",
    permitirCargos("Administrador"),
    cadastrarUsuario
);

router.put(
    "/:id",
    permitirCargos("Administrador"),
    atualizarUsuario
);

router.delete(
    "/:id",
    permitirCargos("Administrador"),
    excluirUsuario
);

module.exports = router;