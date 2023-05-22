const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// analizar solicitudes de tipo de contenido - application/json
app.use(express.json());  

// analizar solicitudes de tipo de contenido - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));  

//  routa de inicio
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la aplicación de scraping para M&M." });
});

require("./app/routes/routes.js")(app);

// levantando el servidor en el puerto 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor Corriendo en el puerto ${PORT}.`);
});
