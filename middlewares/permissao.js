function permitirCargos(...cargosPermitidos) {

    return (req, res, next) => {

        if (!req.usuario) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "Usuário não autenticado."
            });

        }

        if (!cargosPermitidos.includes(req.usuario.cargo)) {

            return res.status(403).json({
                sucesso: false,
                mensagem: "Você não possui permissão para realizar esta ação."
            });

        }

        next();
    };

}

module.exports = permitirCargos;