const Pedido = require("../models/Pedido");
const Cliente = require("../models/Cliente");
const Produto = require("../models/Produto");
const Usuario = require("../models/Usuario");


/*
=========================================
LISTAR PEDIDOS COM FILTROS
=========================================
*/

const listarPedidos = async (req, res) => {

    try {

        const {
            status,
            tipoPedido,
            formaPagamento,
            cliente,
            numeroPedido
        } = req.query;


        /*
        =========================================
        MONTAR FILTROS
        =========================================
        */

        const filtros = {};


        /*
        =========================================
        FILTRAR POR STATUS
        =========================================
        */

        if (status) {

            filtros.status = status;

        }


        /*
        =========================================
        FILTRAR POR TIPO DE PEDIDO
        =========================================
        */

        if (tipoPedido) {

            filtros.tipoPedido = tipoPedido;

        }


        /*
        =========================================
        FILTRAR POR FORMA DE PAGAMENTO
        =========================================
        */

        if (formaPagamento) {

            filtros.formaPagamento = formaPagamento;

        }


        /*
        =========================================
        FILTRAR POR CLIENTE
        =========================================
        */

        if (cliente) {

            filtros.cliente = cliente;

        }


        /*
        =========================================
        BUSCAR POR NÚMERO DO PEDIDO
        =========================================
        */

        if (numeroPedido) {

            filtros.numeroPedido = numeroPedido;

        }


        /*
        =========================================
        BUSCAR PEDIDOS
        =========================================
        */

        const pedidos = await Pedido.find(filtros)

            .populate("cliente")

            .populate("usuario")

            .populate("itens.produto")

            .sort({ createdAt: -1 });


        /*
        =========================================
        RESPOSTA
        =========================================
        */

        res.status(200).json({

            sucesso: true,

            quantidade: pedidos.length,

            pedidos

        });


    } catch (error) {

        res.status(500).json({

            sucesso: false,

            mensagem: "Erro ao buscar pedidos.",

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

        res.status(200).json(pedido);

    } catch (error) {

        res.status(500).json({

            sucesso: false,
            mensagem: "Erro ao buscar pedido.",
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


        /*
        =========================================
        USUÁRIO VEM DO TOKEN
        =========================================
        */

        const usuario = req.usuario.id;


        /*
        =========================================
        VALIDAR CLIENTE
        =========================================
        */

        if (!cliente) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "O cliente é obrigatório."

            });

        }

        const clienteExiste = await Cliente.findById(cliente);

        if (!clienteExiste) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Cliente não encontrado."

            });

        }


        /*
        =========================================
        VALIDAR USUÁRIO
        =========================================
        */

        const usuarioExiste = await Usuario.findById(usuario);

        if (!usuarioExiste) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Usuário não encontrado."

            });

        }


        /*
=========================================
VALIDAR ITENS DO PEDIDO
=========================================
*/

        if (!Array.isArray(itens) || itens.length === 0) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "O pedido deve possuir pelo menos um produto."

            });

        }


        /*
        =========================================
        VALIDAR CADA ITEM
        =========================================
        */

        for (const item of itens) {

            if (!item.produto) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem: "Todos os itens devem possuir um produto."

                });

            }


            if (item.quantidade === undefined || item.quantidade === null) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem: "Todos os itens devem possuir uma quantidade."

                });

            }


            if (
                typeof item.quantidade !== "number" ||
                !Number.isFinite(item.quantidade)
            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem: "A quantidade deve ser um número válido."

                });

            }


            if (item.quantidade <= 0) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem: "A quantidade deve ser maior que zero."

                });

            }


            if (!Number.isInteger(item.quantidade)) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem: "A quantidade deve ser um número inteiro."

                });

            }

        }


        /*
        =========================================
        VALIDAR TIPO DO PEDIDO
        =========================================
        */

        const tiposPermitidos = [

            "Balcao",
            "Retirada",
            "Delivery"

        ];

        if (!tipoPedido) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "O tipo do pedido é obrigatório."

            });

        }

        if (!tiposPermitidos.includes(tipoPedido)) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "Tipo de pedido inválido."

            });

        }


        /*
        =========================================
        VALIDAR FORMA DE PAGAMENTO
        =========================================
        */

        const formasPagamentoPermitidas = [

            "PIX",
            "Dinheiro",
            "Cartao de Credito",
            "Cartao de Debito"

        ];

        if (!formaPagamento) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "A forma de pagamento é obrigatória."

            });

        }

        if (!formasPagamentoPermitidas.includes(formaPagamento)) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "Forma de pagamento inválida."

            });

        }


        /*
        =========================================
        VALIDAR ENDEREÇO DO DELIVERY
        =========================================
        */

        if (tipoPedido === "Delivery") {

            if (!enderecoEntrega) {

                return res.status(400).json({

                    sucesso: false,
                    mensagem: "O endereço de entrega é obrigatório para pedidos Delivery."

                });

            }

            if (
                !enderecoEntrega.rua ||
                !enderecoEntrega.numero ||
                !enderecoEntrega.bairro ||
                !enderecoEntrega.cidade ||
                !enderecoEntrega.cep
            ) {

                return res.status(400).json({

                    sucesso: false,
                    mensagem: "Para Delivery, rua, número, bairro, cidade e CEP são obrigatórios."

                });

            }

        }


        /*
        =========================================
        PROCESSAR PRODUTOS
        =========================================
        */

        const itensPedido = [];

        let valorTotal = 0;


        for (const item of itens) {


            /*
            =========================================
            VALIDAR PRODUTO
            =========================================
            */

            if (!item.produto) {

                return res.status(400).json({

                    sucesso: false,
                    mensagem: "Todos os itens devem possuir um produto."

                });

            }


            /*
            =========================================
            VALIDAR QUANTIDADE
            =========================================
            */

            if (
                item.quantidade === undefined ||
                item.quantidade === null
            ) {

                return res.status(400).json({

                    sucesso: false,
                    mensagem: "A quantidade do produto é obrigatória."

                });

            }

            if (
                typeof item.quantidade !== "number" ||
                !Number.isInteger(item.quantidade) ||
                item.quantidade <= 0
            ) {

                return res.status(400).json({

                    sucesso: false,
                    mensagem: "A quantidade deve ser um número inteiro maior que zero."

                });

            }


            /*
            =========================================
            BUSCAR PRODUTO
            =========================================
            */

            const produto = await Produto.findById(item.produto);

            if (!produto) {

                return res.status(404).json({

                    sucesso: false,
                    mensagem: `Produto não encontrado: ${item.produto}`

                });

            }


            /*
            =========================================
            VERIFICAR DISPONIBILIDADE
            =========================================
            */

            if (!produto.disponivel) {

                return res.status(400).json({

                    sucesso: false,
                    mensagem: `O produto "${produto.nome}" está indisponível.`

                });

            }


            /*
            =========================================
            CALCULAR SUBTOTAL
            =========================================
            */

            const subtotal = produto.preco * item.quantidade;

            valorTotal += subtotal;


            itensPedido.push({

                produto: produto._id,

                quantidade: item.quantidade,

                valorUnitario: produto.preco,

                subtotal

            });

        }


        /*
        =========================================
        GERAR NÚMERO DO PEDIDO
        =========================================
        */

        const anoAtual = new Date()
            .getFullYear()
            .toString();


        const ultimoPedido = await Pedido.findOne()
            .sort({ numeroPedido: -1 });


        let numeroPedido;


        if (!ultimoPedido) {

            numeroPedido = `${anoAtual}00001`;

        } else {

            const ultimoNumero = parseInt(

                ultimoPedido.numeroPedido.substring(4)

            );

            numeroPedido = `${anoAtual}${String(
                ultimoNumero + 1
            ).padStart(5, "0")}`;

        }


        /*
        =========================================
        CRIAR PEDIDO
        =========================================
        */

        const pedido = new Pedido({

            numeroPedido,

            cliente,

            usuario,

            itens: itensPedido,

            valorTotal,

            tipoPedido,

            formaPagamento,

            observacao: observacao || "",

            enderecoEntrega:
                tipoPedido === "Delivery"
                    ? enderecoEntrega
                    : undefined,

            status: "Recebido"

        });


        /*
        =========================================
        SALVAR
        =========================================
        */

        await pedido.save();


        /*
        =========================================
        RESPOSTA
        =========================================
        */

        const pedidoCompleto = await Pedido.findById(pedido._id)

            .populate("cliente")

            .populate("usuario")

            .populate("itens.produto");


        return res.status(201).json({

            sucesso: true,

            mensagem: "Pedido cadastrado com sucesso.",

            pedido: pedidoCompleto

        });


    } catch (error) {

        return res.status(500).json({

            sucesso: false,
            mensagem: "Erro ao cadastrar pedido.",
            erro: error.message

        });

    }

};


/*
=========================================
ATUALIZAR STATUS DO PEDIDO
=========================================
*/

const atualizarStatusPedido = async (req, res) => {

    try {

        const { status } = req.body;


        /*
        =========================================
        VALIDAR STATUS
        =========================================
        */

        const statusPermitidos = [

            "Recebido",
            "Em preparo",
            "Saiu para entrega",
            "Entregue",
            "Cancelado"

        ];


        if (!status) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "O status é obrigatório."

            });

        }


        if (!statusPermitidos.includes(status)) {

            return res.status(400).json({

                sucesso: false,

                mensagem: "Status inválido.",

                statusPermitidos

            });

        }


        /*
        =========================================
        BUSCAR PEDIDO
        =========================================
        */

        const pedido = await Pedido.findById(req.params.id);


        if (!pedido) {

            return res.status(404).json({

                sucesso: false,

                mensagem: "Pedido não encontrado."

            });

        }


        /*
        =========================================
        VERIFICAR PEDIDO FINALIZADO
        =========================================
        */

        if (pedido.status === "Cancelado") {

            return res.status(400).json({

                sucesso: false,

                mensagem: "Não é possível alterar um pedido cancelado."

            });

        }


        if (pedido.status === "Entregue") {

            return res.status(400).json({

                sucesso: false,

                mensagem: "Não é possível alterar um pedido já entregue."

            });

        }


        /*
        =========================================
        ATUALIZAR STATUS
        =========================================
        */

        pedido.status = status;

        await pedido.save();


        /*
        =========================================
        BUSCAR PEDIDO ATUALIZADO
        =========================================
        */

        await pedido.populate("cliente");

        await pedido.populate("usuario");

        await pedido.populate("itens.produto");


        /*
        =========================================
        RESPOSTA
        =========================================
        */

        return res.status(200).json({

            sucesso: true,

            mensagem: "Status do pedido atualizado com sucesso.",

            pedido

        });

    } catch (error) {

        return res.status(500).json({

            sucesso: false,

            mensagem: "Erro ao atualizar status do pedido.",

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

        const pedido = await Pedido.findByIdAndDelete(
            req.params.id
        );


        if (!pedido) {

            return res.status(404).json({

                sucesso: false,
                mensagem: "Pedido não encontrado."

            });

        }


        res.status(200).json({

            sucesso: true,
            mensagem: "Pedido excluído com sucesso."

        });


    } catch (error) {

        res.status(500).json({

            sucesso: false,
            mensagem: "Erro ao excluir pedido.",
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