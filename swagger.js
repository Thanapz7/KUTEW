const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "KUTEW API",
      version: "1.0.0",
      description: "API ตัวอย่างสำหรับ KUTEW",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        posts: {
          type: "object",
          required: ["post_id","details","tag","location","date","price","people","hours","QRcode","user_id"],
          properties: {
            post_id: {type: "integer", description: "The auto-generated id of the post",},
            details: { type: "string", description: "The post detail" },
            tag: { type: "string", description: "The post tag" },
            location: { type: "string", description: "The post location" },
            date: { type: "string", description: "The post date" },
            price: { type: "integer", description: "The post price" },
            people: { type: "integer", description: "The post people" },
            hours: { type: "integer", description: "The post hours" },
            QRcode: { type: "string", description: "The post QRcode" },
            user_id: { type: "integer", description: "The post user id" },
          },
        },
      },
    },
  },
  apis: ["./routes/post.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUi };
