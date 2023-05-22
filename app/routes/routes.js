module.exports = app => {
  const producto = require("../controllers/producto.controller.js");

  var router = require("express").Router();

  // ruta para realizar el scraping
  router.get("/scraping", producto.scraping); 

  // ruta para listar todos los producto
  router.get("/listado-productos", producto.index);
 

  // ruta para listar productos por codigo
  router.get("/:id", producto.findOne);

  app.use('/api/producto', router);
};
