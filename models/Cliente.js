const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true,
        trim: true
    },

    telefone: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ""
    },

    endereco: {

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
        }

    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Cliente", ClienteSchema);