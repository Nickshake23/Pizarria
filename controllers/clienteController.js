const Cliente = require("../models/Cliente");

/*
=========================================
LISTAR CLIENTES
=========================================
*/

/*
=========================================
LISTAR CLIENTES COM PAGINAÇÃO
=========================================
*/
/*
=========================================
LISTAR CLIENTES COM PAGINAÇÃO E ORDENAÇÃO
=========================================
*/
const listarClientes = async (req, res, next) => {

    try {

        const {
            nome,
            telefone,
            email,
            page = 1,
            limit = 10,
            sort = "nome",
            order = "asc"
        } = req.query;


        /*
        =========================================
        VALIDAR PAGINAÇÃO
        =========================================
        */

        const pagina = Number(page);
        const limite = Number(limit);


        if (
            !Number.isInteger(pagina) ||
            pagina < 1
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "A página deve ser um número inteiro maior que 0."

            });

        }


        if (
            !Number.isInteger(limite) ||
            limite < 1 ||
            limite > 100
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "O limite deve ser um número entre 1 e 100."

            });

        }


        /*
        =========================================
        VALIDAR ORDENAÇÃO
        =========================================
        */

        const camposPermitidos = [
            "nome",
            "telefone",
            "email"
        ];


        if (!camposPermitidos.includes(sort)) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "Campo de ordenação inválido."

            });

        }


        if (
            order !== "asc" &&
            order !== "desc"
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "A ordem deve ser asc ou desc."

            });

        }


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
        CALCULAR PAGINAÇÃO
        =========================================
        */

        const pular = (pagina - 1) * limite;


        /*
        =========================================
        DEFINIR ORDENAÇÃO
        =========================================
        */

        const ordem = {

            [sort]: order === "asc" ? 1 : -1

        };


        /*
        =========================================
        BUSCAR CLIENTES
        =========================================
        */

        const clientes = await Cliente.find(filtros)

            .sort(ordem)

            .skip(pular)

            .limit(limite);


        /*
        =========================================
        CONTAR TOTAL
        =========================================
        */

        const total = await Cliente.countDocuments(filtros);


        const totalPaginas = Math.ceil(
            total / limite
        );


        /*
        =========================================
        RESPOSTA
        =========================================
        */

        res.status(200).json({

            sucesso: true,

            pagina,

            limite,

            total,

            totalPaginas,

            quantidade: clientes.length,

            ordenacao: {

                campo: sort,

                ordem: order

            },

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