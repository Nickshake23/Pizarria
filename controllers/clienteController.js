const Cliente = require("../models/Cliente");

/*
=========================================
LISTAR CLIENTES
=========================================
*/

const listarClientes = async (req, res, next) => {

    try {

        const {
            nome,
            telefone,
            email
        } = req.query;


        /*
        =========================================
        MONTAR FILTROS
        =========================================
        */

        const filtros = {};


        /*
        =========================================
        BUSCAR POR NOME
        =========================================
        */

        if (nome) {

            filtros.nome = {
                $regex: nome,
                $options: "i"
            };

        }


        /*
        =========================================
        BUSCAR POR TELEFONE
        =========================================
        */

        if (telefone) {

            filtros.telefone = {
                $regex: telefone,
                $options: "i"
            };

        }


        /*
        =========================================
        BUSCAR POR E-MAIL
        =========================================
        */

        if (email) {

            filtros.email = {
                $regex: email,
                $options: "i"
            };

        }


        /*
        =========================================
        BUSCAR CLIENTES
        =========================================
        */

        const clientes = await Cliente.find(filtros)
            .sort({ nome: 1 });


        /*
        =========================================
        RESPOSTA
        =========================================
        */

        res.status(200).json({

            sucesso: true,

            quantidade: clientes.length,

            clientes

        });

    } catch (error) {

    next(error);

}

};


/*
=========================================
BUSCAR POR ID
=========================================
*/

const buscarCliente = async (req, res, next) => {

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

        next(error);

    }

};


/*
=========================================
CADASTRAR
=========================================
*/

const cadastrarCliente = async (req, res, next) => {

    try {

        const {
            nome,
            telefone,
            email,
            endereco
        } = req.body;


        /*
        =========================================
        VALIDAR CAMPOS OBRIGATÓRIOS
        =========================================
        */

        if (!nome || !telefone) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "Nome e telefone são obrigatórios."

            });

        }


        /*
        =========================================
        VERIFICAR TELEFONE
        =========================================
        */

        const telefoneExiste = await Cliente.findOne({
            telefone
        });

        if (telefoneExiste) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "Já existe um cliente com este telefone."

            });

        }


        /*
        =========================================
        CADASTRAR CLIENTE
        =========================================
        */

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

    next(error);

}

};


/*
=========================================
ATUALIZAR
=========================================
*/

const atualizarCliente = async (req, res, next) => {

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


        res.status(200).json({

            sucesso: true,

            mensagem: "Cliente atualizado com sucesso.",

            cliente

        });

    } catch (error) {

    next(error);

}

};


/*
=========================================
EXCLUIR
=========================================
*/

const excluirCliente = async (req, res, next) => {

    try {

        const cliente = await Cliente.findByIdAndDelete(
            req.params.id
        );


        if (!cliente) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Cliente não encontrado."

            });

        }


        res.status(200).json({

            sucesso: true,

            mensagem: "Cliente removido com sucesso."

        });

    } catch (error) {

    next(error);

}

};


module.exports = {

    listarClientes,

    buscarCliente,

    cadastrarCliente,

    atualizarCliente,

    excluirCliente

};