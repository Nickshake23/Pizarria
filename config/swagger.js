const swaggerJsdoc = require("swagger-jsdoc");


const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "API - Sistema de Pizzaria",

            version: "1.0.0",

            description:
                "Documentação da API do sistema de gerenciamento da pizzaria."

        },


        servers: [

            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }

        ],


        components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT"

                }

            }

        }

    },


    apis: [

        "./routes/*.js"

    ]

};


const swaggerSpec =
    swaggerJsdoc(options);


module.exports =
    swaggerSpec;