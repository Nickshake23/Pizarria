const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    senha: {
        type: String,
        required: true,
        select: false
    },

    cargo: {
        type: String,
        enum: [
            "Administrador",
            "Gerente",
            "Atendente"
        ],
        default: "Atendente"
    },

    ativo: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Usuario", UsuarioSchema);