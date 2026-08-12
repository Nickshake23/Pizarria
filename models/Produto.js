const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true,
        trim: true
    },

    descricao: {
        type: String,
        default: ""
    },

    imagem: {
    type: String,
    default: ""
    },

    categoria: {
        type: String,
        required: true,
        enum: [
            "Pizza",
            "Bebida",
            "Sobremesa",
            "Porcao"
        ]
    },

    preco: {
        type: Number,
        required: true,
        min: 0
    },

    tamanho: {
        type: String,
        default: ""
    },

    ingredientes: {
        type: [String],
        default: []
    },

    disponivel: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

ProdutoSchema.index({

    nome: "text",


});

module.exports = mongoose.model("Produto", ProdutoSchema);