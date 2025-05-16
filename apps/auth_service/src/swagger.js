import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Auth Service API",
        description: "Automatically generated swagger docs",
        version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFile = ["./routes/auth.route.ts"];

swaggerAutogen()(outputFile, endpointsFile, doc)
