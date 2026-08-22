const Cliente = require("../models/Cliente");
const Produto = require("../models/Produto");
const Pedido = require("../models/Pedido");


/*
=========================================
DASHBOARD
=========================================
*/

const obterDashboard = async (req, res, next) => {

    try {

        /*
        =========================================
        VALIDAÇÃO E FILTRO POR PERÍODO
        =========================================
        */

        const validarData = (data) => {

            const formato = /^\d{4}-\d{2}-\d{2}$/;

            if (!formato.test(data)) {
                return false;
            }


            const [ano, mes, dia] =
                data.split("-").map(Number);


            const dataTeste =
                new Date(ano, mes - 1, dia);


            return (
                dataTeste.getFullYear() === ano &&
                dataTeste.getMonth() === mes - 1 &&
                dataTeste.getDate() === dia
            );

        };


        const {
            inicio,
            fim
        } = req.query;


        /*
        =========================================
        VALIDAÇÃO DA DATA INICIAL
        =========================================
        */

        if (inicio && !validarData(inicio)) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "A data inicial é inválida. Use o formato YYYY-MM-DD."

            });

        }


        /*
        =========================================
        VALIDAÇÃO DA DATA FINAL
        =========================================
        */

        if (fim && !validarData(fim)) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "A data final é inválida. Use o formato YYYY-MM-DD."

            });

        }


        /*
        =========================================
        FILTRO DE PERÍODO
        =========================================
        */

        const filtroPeriodo = {};


        if (inicio) {

            filtroPeriodo.createdAt = {

                $gte:
                    new Date(`${inicio}T00:00:00`)

            };

        }


        if (fim) {

            filtroPeriodo.createdAt = {

                ...filtroPeriodo.createdAt,

                $lte:
                    new Date(`${fim}T23:59:59.999`)

            };

        }


        /*
        =========================================
        VALIDAÇÃO DO INTERVALO
        =========================================
        */

        if (inicio && fim) {

            const dataInicio =
                new Date(`${inicio}T00:00:00`);

            const dataFim =
                new Date(`${fim}T23:59:59.999`);


            if (dataInicio > dataFim) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "A data inicial não pode ser maior que a data final."

                });

            }

        }


        /*
        =========================================
        CONTADORES DO DASHBOARD
        =========================================
        */

        const [

            totalClientes,

            totalProdutos,

            produtosDisponiveis,

            totalPedidos,

            pedidosRecebidos,

            pedidosEmPreparo,

            pedidosProntos,

            pedidosSaiuEntrega,

            pedidosEntregues,

            pedidosCancelados

        ] = await Promise.all([


            Cliente.countDocuments(),


            Produto.countDocuments(),


            Produto.countDocuments({
                disponivel: true
            }),


            Pedido.countDocuments(
                filtroPeriodo
            ),


            Pedido.countDocuments({

                ...filtroPeriodo,

                status: "Recebido"

            }),


            Pedido.countDocuments({

                ...filtroPeriodo,

                status: "Em preparo"

            }),


            Pedido.countDocuments({

                ...filtroPeriodo,

                status: "Pronto"

            }),


            Pedido.countDocuments({

                ...filtroPeriodo,

                status: "Saiu para entrega"

            }),


            Pedido.countDocuments({

                ...filtroPeriodo,

                status: "Entregue"

            }),


            Pedido.countDocuments({

                ...filtroPeriodo,

                status: "Cancelado"

            })

        ]);


        /*
        =========================================
        CONSULTAS PRINCIPAIS DO DASHBOARD
        =========================================
        */

        const [

            ultimosPedidos,

            produtosMaisVendidos,

            faturamentoPorDia,

            vendasPorFormaPagamento,

            vendasPorTipoPedido,

            resultadoFinanceiro

        ] = await Promise.all([


            /*
            =========================================
            ÚLTIMOS PEDIDOS
            =========================================
            */

            Pedido.find(filtroPeriodo)

                .select(
                    "numeroPedido cliente usuario valorTotal tipoPedido formaPagamento status createdAt"
                )

                .sort({
                    createdAt: -1
                })

                .limit(5)

                .populate(
                    "cliente",
                    "nome telefone"
                )

                .populate(
                    "usuario",
                    "nome cargo"
                ),


            /*
            =========================================
            PRODUTOS MAIS VENDIDOS
            =========================================
            */

            Pedido.aggregate([

                {
                    $match: {

                        ...filtroPeriodo,

                        status: {
                            $ne: "Cancelado"
                        }

                    }
                },

                {
                    $unwind: "$itens"
                },

                {
                    $group: {

                        _id: "$itens.produto",

                        quantidadeVendida: {
                            $sum: "$itens.quantidade"
                        }

                    }
                },

                {
                    $lookup: {

                        from: "produtos",

                        localField: "_id",

                        foreignField: "_id",

                        as: "produto"

                    }
                },

                {
                    $unwind: "$produto"
                },

                {
                    $project: {

                        _id: 0,

                        produto:
                            "$produto.nome",

                        quantidadeVendida: 1

                    }
                },

                {
                    $sort: {
                        quantidadeVendida: -1
                    }
                },

                {
                    $limit: 5
                }

            ]),


            /*
            =========================================
            FATURAMENTO POR DIA
            =========================================
            */

            Pedido.aggregate([

                {
                    $match: {

                        ...filtroPeriodo,

                        status: {
                            $ne: "Cancelado"
                        }

                    }
                },

                {
                    $group: {

                        _id: {

                            $dateToString: {

                                format:
                                    "%Y-%m-%d",

                                date:
                                    "$createdAt"

                            }

                        },

                        valor: {
                            $sum: "$valorTotal"
                        }

                    }
                },

                {
                    $sort: {
                        _id: 1
                    }
                },

                {
                    $project: {

                        _id: 0,

                        data: "$_id",

                        valor: 1

                    }
                }

            ]),


            /*
            =========================================
            VENDAS POR FORMA DE PAGAMENTO
            =========================================
            */

            Pedido.aggregate([

                {
                    $match: {

                        ...filtroPeriodo,

                        status: {
                            $ne: "Cancelado"
                        }

                    }
                },

                {
                    $group: {

                        _id:
                            "$formaPagamento",

                        quantidadePedidos: {
                            $sum: 1
                        },

                        valorTotal: {
                            $sum: "$valorTotal"
                        }

                    }
                },

                {
                    $project: {

                        _id: 0,

                        formaPagamento:
                            "$_id",

                        quantidadePedidos: 1,

                        valorTotal: 1

                    }
                },

                {
                    $sort: {
                        valorTotal: -1
                    }
                }

            ]),


            /*
            =========================================
            VENDAS POR TIPO DE PEDIDO
            =========================================
            */

            Pedido.aggregate([

                {
                    $match: {

                        ...filtroPeriodo,

                        status: {
                            $ne: "Cancelado"
                        }

                    }
                },

                {
                    $group: {

                        _id:
                            "$tipoPedido",

                        quantidadePedidos: {
                            $sum: 1
                        },

                        valorTotal: {
                            $sum: "$valorTotal"
                        }

                    }
                },

                {
                    $project: {

                        _id: 0,

                        tipoPedido:
                            "$_id",

                        quantidadePedidos: 1,

                        valorTotal: 1

                    }
                },

                {
                    $sort: {
                        valorTotal: -1
                    }
                }

            ]),


            /*
            =========================================
            RESUMO FINANCEIRO
            =========================================
            */

            Pedido.aggregate([

                {
                    $match: {

                        ...filtroPeriodo

                    }
                },

                {
                    $group: {

                        _id: null,

                        faturamentoBruto: {
                            $sum: "$valorTotal"
                        },

                        valorCancelado: {

                            $sum: {

                                $cond: [

                                    {
                                        $eq: [
                                            "$status",
                                            "Cancelado"
                                        ]
                                    },

                                    "$valorTotal",

                                    0

                                ]

                            }

                        },

                        pedidosNaoCancelados: {

                            $sum: {

                                $cond: [

                                    {
                                        $ne: [
                                            "$status",
                                            "Cancelado"
                                        ]
                                    },

                                    1,

                                    0

                                ]

                            }

                        }

                    }
                }

            ])

        ]);


        /*
        =========================================
        CÁLCULOS FINANCEIROS
        =========================================
        */

        const faturamentoBruto =
            resultadoFinanceiro.length > 0
                ? resultadoFinanceiro[0]
                    .faturamentoBruto
                : 0;


        const valorCancelado =
            resultadoFinanceiro.length > 0
                ? resultadoFinanceiro[0]
                    .valorCancelado
                : 0;


        const pedidosNaoCancelados =
            resultadoFinanceiro.length > 0
                ? resultadoFinanceiro[0]
                    .pedidosNaoCancelados
                : 0;


        const faturamentoLiquido =
            faturamentoBruto -
            valorCancelado;


        const ticketMedio =
            pedidosNaoCancelados > 0
                ? faturamentoLiquido /
                    pedidosNaoCancelados
                : 0;


        /*
        =========================================
        RESPOSTA
        =========================================
        */

        res.status(200).json({

    sucesso: true,

    dashboard: {

        /*
        =========================================
        INFORMAÇÕES GERAIS
        =========================================
        */

        geral: {

            totalClientes,

            totalProdutos,

            produtosDisponiveis

        },


        /*
        =========================================
        PEDIDOS
        =========================================
        */

        pedidos: {

            total: totalPedidos,

            porStatus: {

                recebidos:
                    pedidosRecebidos,

                emPreparo:
                    pedidosEmPreparo,

                prontos:
                    pedidosProntos,

                saiuParaEntrega:
                    pedidosSaiuEntrega,

                entregues:
                    pedidosEntregues,

                cancelados:
                    pedidosCancelados

            }

        },


        /*
        =========================================
        FINANCEIRO
        =========================================
        */

        financeiro: {

            faturamentoBruto,

            valorCancelado,

            faturamentoLiquido,

            ticketMedio

        },


        /*
        =========================================
        RELATÓRIOS
        =========================================
        */

        relatorios: {

            produtosMaisVendidos,

            faturamentoPorDia,

            vendasPorFormaPagamento,

            vendasPorTipoPedido

        },


        /*
        =========================================
        ÚLTIMOS PEDIDOS
        =========================================
        */

        ultimosPedidos

    }

});


    } catch (error) {

        next(error);

    }

};


module.exports = {

    obterDashboard

};