const Cliente = require("../models/Cliente");

/*
=========================================
LISTAR
=========================================
*/
const listarClientes = async (req, res) => {

    try {

        const clientes = await Cliente.find().sort({ nome: 1 });

        res.status(200).json(clientes);

    } catch (error) {

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao buscar clientes.",
            erro: error.message
        });

    }

};

/*
=========================================
BUSCAR POR ID
=========================================
*/
const buscarCliente = async (req, res) => {

    try {

        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {

            return res.status(404).json({
                sucesso: false,
                mensagem: "Cliente não encontrado."
            });

        }

        res.status(200).json(cliente);

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
const cadastrarCliente = async (req, res) => {

    try {

        const {

            nome,
            telefone,
            email,
            endereco

        } = req.body;

        if (!nome || !telefone) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "Nome e telefone são obrigatórios."

            });

        }

        const cliente = new Cliente({

            nome,
            telefone,
            email,
            endereco

        });

        await cliente.save();

        res.status(201).json({

            sucesso: true,
            mensagem: "Cliente cadastrado com sucesso.",
            cliente

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
const atualizarCliente = async (req, res) => {

    try {

        const cliente = await Cliente.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,
                runValidators: true

            }

        );

        if (!cliente) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Cliente não encontrado."

            });

        }

        res.json({

            sucesso: true,
            mensagem: "Cliente atualizado.",
            cliente

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
const excluirCliente = async (req, res) => {

    try {

        const cliente = await Cliente.findByIdAndDelete(req.params.id);

        if (!cliente) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Cliente não encontrado."

            });

        }

        res.json({

            sucesso: true,
            mensagem: "Cliente removido."

        });

    } catch (error) {

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

};

module.exports = {

    listarClientes,
    buscarCliente,
    cadastrarCliente,
    atualizarCliente,
    excluirCliente

};