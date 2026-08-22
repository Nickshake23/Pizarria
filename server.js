const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const conectarBanco = require("./config/database");
const swaggerSpec = require("./config/swagger");

const clientesRoutes = require("./routes/clientes");
const produtosRoutes = require("./routes/produtos");
const usuariosRoutes = require("./routes/usuarios");
const pedidosRoutes = require("./routes/pedidos");
const dashboardRoutes = require("./routes/dashboard");

const errorHandler = require("./middlewares/errorHandler");


const app = express();


app.use(cors());

app.use(express.json());


/*
=========================================
SWAGGER
=========================================
*/

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);


/*
=========================================
BANCO DE DADOS
=========================================
*/

conectarBanco();


/*
=========================================
ROTA PRINCIPAL
=========================================
*/

app.get("/", (req, res) => {

    res.json({
        mensagem: "API da Pizzaria funcionando!"
    });

});


/*
=========================================
ROTAS
=========================================
*/

app.use("/usuarios", usuariosRoutes);

app.use("/clientes", clientesRoutes);

app.use("/produtos", produtosRoutes);

app.use("/pedidos", pedidosRoutes);

app.use("/dashboard", dashboardRoutes);


/*
=========================================
TRATAMENTO GLOBAL DE ERROS
=========================================
*/

app.use(errorHandler);


/*
=========================================
SERVIDOR
=========================================
*/

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

});