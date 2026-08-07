const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*
=========================================
LISTAR USUÁRIOS
=========================================
*/
const listarUsuarios = async (req, res) => {

    try {

        const usuarios = await Usuario.find().sort({ nome: 1 });

        res.json(usuarios);

    } catch (error) {

        res.status(500).json({
            sucesso: false,
            erro: error.message
        });

    }

};

/*
=========================================
BUSCAR USUÁRIO
=========================================
*/
const buscarUsuario = async (req, res) => {

    try {

        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {

            return res.status(404).json({
                sucesso: false,
                mensagem: "Usuário não encontrado."
            });

        }

        res.json(usuario);

    } catch (error) {

        res.status(500).json({
            sucesso: false,
            erro: error.message
        });

    }

};

/*
=========================================
CADASTRAR USUÁRIO
=========================================
*/
const cadastrarUsuario = async (req, res) => {

    try {

        const { nome, email, senha, cargo } = req.body;

        const existe = await Usuario.findOne({ email });

        if (existe) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "E-mail já cadastrado."
            });

        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = new Usuario({

            nome,
            email,
            senha: senhaCriptografada,
            cargo

        });

        await usuario.save();

        res.status(201).json({

            sucesso: true,
            mensagem: "Usuário cadastrado com sucesso."

        });

    } catch (error) {

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

};

/*
=========================================
LOGIN
=========================================
*/
const login = async (req, res) => {

    try {

        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email }).select("+senha");

        if (!usuario) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "E-mail ou senha inválidos."
            });

        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "E-mail ou senha inválidos."
            });

        }

        const token = jwt.sign(

            {
                id: usuario._id,
                cargo: usuario.cargo
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "8h"
            }

        );

        res.json({

            sucesso: true,
            mensagem: "Login realizado com sucesso.",

            token,

            usuario: {

                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo

            }

        });

    } catch (error) {

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
const atualizarUsuario = async (req, res) => {

    try {

        if (req.body.senha) {

            req.body.senha = await bcrypt.hash(req.body.senha, 10);

        }

        const usuario = await Usuario.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,
                runValidators: true

            }

        );

        if (!usuario) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Usuário não encontrado."

            });

        }

        res.json({

            sucesso: true,
            mensagem: "Usuário atualizado.",
            usuario

        });

    } catch (error) {

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
const excluirUsuario = async (req, res) => {

    try {

        const usuario = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuario) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Usuário não encontrado."

            });

        }

        res.json({

            sucesso: true,
            mensagem: "Usuário removido."

        });

    } catch (error) {

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

};

module.exports = {

    listarUsuarios,
    buscarUsuario,
    cadastrarUsuario,
    login,
    atualizarUsuario,
    excluirUsuario

};