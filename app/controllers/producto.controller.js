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
  Producto.findById({id:req.params.id,columna:req.params.columna}, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Producto no encontrado con el dato ${req.params.id} filtrado por la columna ${req.params.columna}.`
        });
      } else {
        res.status(500).send({
          message: `Error al recuperar el producto con dato ${req.params.id} filtrado por la columna ${req.params.columna}.`
        });
      }
    } else res.send(data);
  });
};

 
 
// metodo encargado de realizar el scraping
exports.scraping = (req, res) => {
  console.log("inicialdo el scraping")

  scrape().then((value) => {
    console.log('Collection length: ' + value.length);
    
    value.map(texto =>{
  
        agregarProductos(texto)
    })
  
    res.json({ message: "scaping completado." });

  });
};

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://volvorepuestos.com.pe/repuestos-camiones-volvo/fm-fmx.html',{timeout: 900000})

  var results = []; // variable para mantener la colección de todos los títulos y precios de los libros
  // esta es la última página del catálogo codificada osea se iterara de la pagina 1 a la 5 con fines de pruebas
  var lastPageNumber = 50; 
  //selector de pagina siguiente
  var selector_pag_siguiente = '#layer-product-list > div:nth-child(1) > div.pages > ul > li.item.pages-item-next > a';
  // bucle simple definido para iterar sobre el número de páginas del catálogo
  for (let index = 0; index < lastPageNumber; index++) {
       
      new Promise(r => setTimeout(r, 1000))
      // llame y espere extraídaEvaluateCall y concatene los resultados de cada iteración.
      //retornara el texto obtenido de cada pagina iterada
      results = results.concat(await extractedEvaluateCall(page));
    
      // aquí es donde se hizo clic en el siguiente botón de la página para saltar a otra página
      if (index != lastPageNumber - 1) {
          //botón siguiente en la última página
          if (await page.$(selector_pag_siguiente) !== null) await page.click(selector_pag_siguiente);
          else console.log('se acabaron las paginas');
          
      }
  }

  browser.close();
  return results;
};

/**
* metodo encargado de realizar scraping
*/
async function extractedEvaluateCall(page) {
  //identificar el elemento al que se le desea hacer el scraping
  const f = await page.$("#layer-product-list > div.products.wrapper.grid.columns4.products-grid > ol")
  //obtener el scraing de todos los producto de la pagina actual
  const texto = await (await f.getProperty('innerText')).jsonValue()

  return texto;

}

/**
* metodo encargado de almacenar cada producto al json global 
* @param {*} texto 
*/
function agregarProductos(texto) {
  
  // separar todo el texto obtenido por productos
  // en este caso usaremos el texto " Añadir al carrito" para identificar el fin de cada producto
  let separarText = texto.split(' Añadir al carrito')
 
  //iterar todos los productos obtenidos
  separarText.map(productoText => {
      if (productoText.length  <= 1) {
          return
      }
      //convertir texto a arreglo
      let separarProducto= productoText.split('\n\n',-1)
      //separar el texto para obtener el codigo del producto
      let separarCodigo = separarProducto[1].split('\n')
      //separar precio para saber si existe un producto con descuento
      let separarPrecio = separarProducto[2].split('\nPrecio especial\n')

      //obtener la descripcion del producto
      let DESCRIPCION = separarProducto[0].replace('\n','')
      //obtener el codigo del producto
      let CODIGO_DEL_REPUESTO =  separarCodigo[1]
      //obtener el precio estimado del producto
      let PRECIO_ESTIMADO =  separarPrecio[separarPrecio.length - 1].replace('\n','')
      //obtener el precio anterior del producto en el caso de q no exista un descuento el PRECIO_ANTERIOR = PRECIO_ESTIMADO
      let PRECIO_ANTERIOR =  separarPrecio[0].replace('\n','')

      //agrerar el producto a la base de datos
      const producto = new Producto({
        DESCRIPCION,
        CODIGO_DEL_REPUESTO,
        PRECIO_ANTERIOR,
        PRECIO_ESTIMADO,
      });

      // Save Tutorial in the database
      Producto.create(producto, (err, data) => {
        if (err){

          respuesta = {
            message:
              err.message || "Ocurrió algún error al crear el Producto."
          };
          console.log(respuesta);
        }
        //else respuesta = data;
      });
      })

      
}



