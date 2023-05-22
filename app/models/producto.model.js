const sql = require("./db.js");

// constructor
const Producto = function(producto) {
  this.DESCRIPCION = producto.DESCRIPCION;
  this.CODIGO_DEL_REPUESTO = producto.CODIGO_DEL_REPUESTO;
  this.PRECIO_ANTERIOR = producto.PRECIO_ANTERIOR;
  this.PRECIO_ESTIMADO = producto.PRECIO_ESTIMADO;
};

//metodo encargado de crear los productos en la base de datos
Producto.create = (newProducto, result) => {
  sql.query("INSERT INTO productos SET ?", newProducto, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Producto Creado: ", { id: res.insertId, ...newProducto });
    result(null, { id: res.insertId, ...newProducto });
  });
};

//metodo encargado de listar un producto por codigo del mismo
Producto.findById = (data, result) => {
  sql.query(`SELECT * FROM productos WHERE ${data.columna} like '%${data.id}%'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found productos: ", res[0]);
      result(null, res[0]);
      return;
    }

    // se se encontraron registros
    result({ kind: "not_found" }, null);
  });
};

//metodo encargado de listar todos los productos
Producto.getAll = (title, result) => {
  let query = "SELECT * FROM productos";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("productos: ", res);
    result(null, res);
  });
};


module.exports = Producto;
