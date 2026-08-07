const mongoose = require("mongoose");

const ItemPedidoSchema = new mongoose.Schema({

    produto: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Produto",
        required: true

    },

    quantidade: {

        type: Number,
        required: true,
        min: 1

    },

    valorUnitario: {

        type: Number,
        required: true,
        min: 0

    },

    subtotal: {

        type: Number,
        required: true,
        min: 0

    }

}, {
    _id: false
});

const PedidoSchema = new mongoose.Schema({

    numeroPedido: {

        type: String,
        unique: true,
        required: true

    },

    cliente: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true

    },

    usuario: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true

    },

    itens: {

        type: [ItemPedidoSchema],
        validate: {

            validator: function (itens) {

                return itens.length > 0;

            },

            message: "O pedido deve possuir pelo menos um produto."

        }

    },

    valorTotal: {

        type: Number,
        default: 0

    },

    tipoPedido: {

        type: String,

        enum: [

            "Balcao",
            "Retirada",
            "Delivery"

        ],

        required: true

    },

    formaPagamento: {

        type: String,

        enum: [

            "PIX",
            "Dinheiro",
            "Cartao de Credito",
            "Cartao de Debito"

        ],

        required: true

    },

    status: {

        type: String,

        enum: [

             "Recebido",
             
             "Em preparo",
             
             "Pronto",
             
             "Saiu para entrega",
             
             "Entregue",
             
             "Cancelado"

        ],

        default: "Recebido"

    },

    observacao: {

        type: String,
        default: ""

    },

    enderecoEntrega: {

        rua: {

            type: String,
            default: ""

        },

        numero: {

            type: Number,
            default: 0

        },

        bairro: {

            type: String,
            default: ""

        },

        cidade: {

            type: String,
            default: ""

        },

        cep: {

            type: String,
            default: ""

        },

        complemento: {

            type: String,
            default: ""

        }

    }

}, {

    timestamps: true

});

/*
=========================================
ÍNDICES
=========================================
*/

PedidoSchema.index({

    status: 1

});

PedidoSchema.index({

    cliente: 1

});

PedidoSchema.index({

    createdAt: -1

});

module.exports = mongoose.model("Pedido", PedidoSchema);
