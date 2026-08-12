const errorHandler = (error, req, res, next) => {

    console.error(error);

    /*
    =========================================
    ERRO DE ID DO MONGODB
    =========================================
    */

    if (error.name === "CastError") {

        return res.status(400).json({

            sucesso: false,

            mensagem: "ID informado é inválido."

        });

    }


    /*
    =========================================
    ERRO DE VALIDAÇÃO DO MONGOOSE
    =========================================
    */

    if (error.name === "ValidationError") {

        const erros = {};

        Object.keys(error.errors).forEach((campo) => {

            erros[campo] = error.errors[campo].message;

        });

        return res.status(400).json({

            sucesso: false,

            mensagem: "Dados inválidos.",

            erros

        });

    }


    /*
    =========================================
    ERRO DE DUPLICIDADE
    =========================================
    */

    if (error.code === 11000) {

        const campo = Object.keys(error.keyPattern)[0];

        return res.status(409).json({

            sucesso: false,

            mensagem: `O campo "${campo}" já está cadastrado.`

        });

    }


    /*
    =========================================
    ERRO INTERNO
    =========================================
    */

    return res.status(500).json({

        sucesso: false,

        mensagem: "Erro interno do servidor."

    });

};

module.exports = errorHandler;