const express = require("express"); 

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger_output.json');
const cors = require("cors");

const v1Router = require("./v1/routes");

const bodyParser = require("body-parser");
const v1ProducteRouter = require("./v1/routes/producteRoutes");
const v1EstocRouter = require("./v1/routes/estocRoutes");
const v1MaquinaRouter = require("./v1/routes/maquinaRoutes");

const app = express(); 
const PORT = process.env.PORT || 3000; 

app.use(cors())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// For testing purposes 
app.get("/", (req, res) => { 
    res.send("<h2>It's Working!</h2>"); 
}); 

app.use("/api/v1", v1Router);



app.use(bodyParser.json());
app.use("/api/v1/productes", v1ProducteRouter);
app.use("/api/v1/estocs", v1EstocRouter);
app.use("/api/v1/maquines", v1MaquinaRouter);

app.listen(PORT, () => { 
    console.log(`API is listening on port ${PORT}`); 
});