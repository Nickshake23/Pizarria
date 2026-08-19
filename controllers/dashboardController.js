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
    
        const {
            inicio,
            fim
        } = req.query;

        const filtroPeriodo = {};

        if (inicio) {
                    
            filtroPeriodo.createdAt = {
                $gte: new Date(`${inicio}T00:00:00`)
            };
        
        }

        if (fim) {

            filtroPeriodo.createdAt = {
            
                ...filtroPeriodo.createdAt,
            
                $lte: new Date(`${fim}T23:59:59.999`)
            
            };
        
        }

        if (inicio && isNaN(new Date(`${inicio}T00:00:00`).getTime())) {

    return res.status(400).json({

        sucesso: false,

        mensagem: "A data inicial é inválida."

    });

}


if (fim && isNaN(new Date(`${fim}T00:00:00`).getTime())) {

    return res.status(400).json({

        sucesso: false,

        mensagem: "A data final é inválida."

    });

}

if (inicio && fim) {

    const dataInicio = new Date(`${inicio}T00:00:00`);
    const dataFim = new Date(`${fim}T23:59:59.999`);

    if (dataInicio > dataFim) {

        return res.status(400).json({

            sucesso: false,

            mensagem: "A data inicial não pode ser maior que a data final."

        });

    }

}



        

        const totalClientes =
            await Cliente.countDocuments();


        const totalProdutos =
            await Produto.countDocuments();


        const produtosDisponiveis =
            await Produto.countDocuments({
                disponivel: true
            });


        const totalPedidos =
            await Pedido.countDocuments(filtroPeriodo);


        /*
        =========================================
        PEDIDOS POR STATUS
        =========================================
        */

        const pedidosRecebidos =
            await Pedido.countDocuments({
        ...filtroPeriodo,
        status: "Recebido"
            });


        const pedidosEmPreparo =
             await Pedido.countDocuments({
        ...filtroPeriodo,
        status: "Em preparo"
            });


        const pedidosSaiuEntrega =
             await Pedido.countDocuments({
        ...filtroPeriodo,
        status: "Saiu para entrega"
            });


        const pedidosEntregues =
             await Pedido.countDocuments({
        ...filtroPeriodo,
        status: "Entregue"
            });


        const pedidosCancelados =
             await Pedido.countDocuments({
        ...filtroPeriodo,
        status: "Cancelado"
            });


        /*
        =========================================
        VALOR TOTAL DAS VENDAS
        =========================================
        */

const resultadoVendas = await Pedido.aggregate([

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

            _id: null,

            valorTotalVendas: {
                $sum: "$valorTotal"
            }

        }
    }

]);


        const valorTotalVendas =
            resultadoVendas.length > 0
                ? resultadoVendas[0].valorTotalVendas
                : 0;

 /*
=========================================
ÚLTIMOS PEDIDOS
=========================================
*/

        const ultimosPedidos = await Pedido.find(filtroPeriodo)
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("cliente", "nome telefone")
            .populate("usuario", "nome cargo")
            .populate("itens.produto", "nome preco");

/*
=========================================
PRODUTOS MAIS VENDIDOS
=========================================
*/

/*
=========================================
PRODUTOS MAIS VENDIDOS
=========================================
*/

const produtosMaisVendidos = await Pedido.aggregate([

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

            produto: "$produto.nome",

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

]);

        /*
        =========================================
        RESPOSTA
        =========================================
        */

        res.status(200).json({

            sucesso: true,

            dashboard: {

                totalClientes,

                totalProdutos,

                produtosDisponiveis,

                totalPedidos,

                pedidosRecebidos,

                pedidosEmPreparo,

                pedidosSaiuEntrega,

                pedidosEntregues,

                pedidosCancelados,

                valorTotalVendas,

                ultimosPedidos,

                produtosMaisVendidos

            }

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {

    obterDashboard

};