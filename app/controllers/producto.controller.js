const puppeteer = require('puppeteer');
const path = require('path');
const Producto = require("../models/producto.model.js");
 
 
// metodo encargado de retornar todos los productos
exports.index = (req, res) => {
  const title = '';

  Producto.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Se produjo un error al recuperar los productos."
      });
    else res.send(data);
  });
};

// metodo encargado de retornar el producto por codigo de producto
exports.findOne = (req, res) => {
  Producto.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Producto no encontrado con el codigo ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error al recuperar el producto con codigo " + req.params.id
        });
      }
    } else res.send(data);
  });
};

 
 




