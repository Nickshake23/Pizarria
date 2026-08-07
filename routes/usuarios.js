const express = require("express");
const router = express.Router();

const autenticarToken = require("../middlewares/auth");

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

router.post("/", cadastrarUsuario);

router.put("/:id", atualizarUsuario);

router.delete("/:id", excluirUsuario);

module.exports = router;