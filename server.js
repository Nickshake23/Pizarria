const express = require("express");
const cors = require("cors");
require("dotenv").config();

const conectarBanco = require("./config/database");

const clientesRoutes = require("./routes/clientes");
const produtosRoutes = require("./routes/produtos");
const usuariosRoutes = require("./routes/usuarios");
const pedidosRoutes = require("./routes/pedidos");
const dashboardRoutes = require("./routes/dashboard");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

conectarBanco();

app.get("/", (req, res) => {
    res.json({
        mensagem: "API da Pizzaria funcionando!"
    });
});

app.use("/usuarios", usuariosRoutes);
app.use("/clientes", clientesRoutes);
app.use("/produtos", produtosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/dashboard", dashboardRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});