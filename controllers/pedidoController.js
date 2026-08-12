const Pedido = require("../models/Pedido");
const Cliente = require("../models/Cliente");
const Produto = require("../models/Produto");
const Usuario = require("../models/Usuario");

/*
=========================================
LISTAR PEDIDOS
=========================================
*/

const listarPedidos = async (req, res) => {

    try {

        const pedidos = await Pedido.find()

            .populate("cliente")

            .populate("usuario")

            .populate("itens.produto")

            .sort({ createdAt: -1 });

        res.json(pedidos);

    } catch (error) {

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

};

/*
=========================================
BUSCAR PEDIDO POR ID
=========================================
*/

const buscarPedido = async (req, res) => {

    try {

        const pedido = await Pedido.findById(req.params.id)

            .populate("cliente")

            .populate("usuario")

            .populate("itens.produto");

        if (!pedido) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Pedido não encontrado."

            });

        }

        res.json(pedido);

    } catch (error) {

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

};

/*
=========================================
CADASTRAR PEDIDO
=========================================
*/

const cadastrarPedido = async (req, res) => {

    try {

        const {
            cliente,
            itens,
            tipoPedido,
            formaPagamento,
            observacao,
            enderecoEntrega

        } = req.body;

        const usuario = req.usuario.id;

        const clienteExiste = await Cliente.findById(cliente);

        if (!clienteExiste) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Cliente não encontrado."

            });

        }

        const usuarioExiste = await Usuario.findById(usuario);

        if (!usuarioExiste) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Usuário não encontrado."

            });

        }

        if (!itens || itens.length === 0) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "O pedido deve possuir pelo menos um produto."

            });

        }

        const itensPedido = [];

        let valorTotal = 0;

        for (const item of itens) {

            const produto = await Produto.findById(item.produto);

            if (!produto) {

                return res.status(404).json({

                    sucesso: false,
                    mensagem: `Produto não encontrado: ${item.produto}`

                });

            }

            if (!produto.disponivel) {

                return res.status(400).json({

                    sucesso: false,
                    mensagem: `O produto "${produto.nome}" está indisponível.`

                });

            }

            const subtotal = produto.preco * item.quantidade;

            valorTotal += subtotal;

            itensPedido.push({

                produto: produto._id,

                quantidade: item.quantidade,

                valorUnitario: produto.preco,

                subtotal

            });

        }

        const anoAtual = new Date().getFullYear().toString();

        const ultimoPedido = await Pedido.findOne().sort({

            numeroPedido: -1

        });

        let numeroPedido;

        if (!ultimoPedido) {

            numeroPedido = `${anoAtual}00001`;

        } else {

            const ultimoNumero = parseInt(

                ultimoPedido.numeroPedido.substring(4)

            );

            numeroPedido = `${anoAtual}${String(ultimoNumero + 1).padStart(5, "0")}`;

        }

        const pedido = new Pedido({

            numeroPedido,

            cliente,

            usuario,

            itens: itensPedido,

            valorTotal,

            tipoPedido,

            formaPagamento,

            observacao,

            enderecoEntrega,

            status: "Recebido"

        });

        await pedido.save();

        res.status(201).json({

            sucesso: true,

            mensagem: "Pedido cadastrado com sucesso.",

            pedido

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
ATUALIZAR STATUS
=========================================
*/

const atualizarStatusPedido = async (req, res) => {

    try {

        const { status } = req.body;

        const pedido = await Pedido.findByIdAndUpdate(

            req.params.id,

            { status },

            {

                new: true,
                runValidators: true

            }

        );

        if (!pedido) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Pedido não encontrado."

            });

        }

        res.json({

            sucesso: true,

            mensagem: "Status atualizado com sucesso.",

            pedido

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
EXCLUIR PEDIDO
=========================================
*/

const excluirPedido = async (req, res) => {

    try {

        const pedido = await Pedido.findByIdAndDelete(req.params.id);

        if (!pedido) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Pedido não encontrado."

            });

        }

        res.json({

            sucesso: true,
            mensagem: "Pedido excluído."

        });

    } catch (error) {

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

};

module.exports = {

    listarPedidos,

    buscarPedido,

    cadastrarPedido,

    atualizarStatusPedido,

    excluirPedido

};