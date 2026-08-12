const errorHandler = (error, req, res, next) => {

    console.error("ERRO:", error);


    /*
    =========================================
    ID DO MONGODB INVÁLIDO
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
    DADO DUPLICADO
    =========================================
    */

    if (error.code === 11000) {

    const campo = error.keyPattern
        ? Object.keys(error.keyPattern)[0]
        : "informação";

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