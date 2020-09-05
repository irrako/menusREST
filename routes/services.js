var express = require('express');
var router = express.Router();
var MENUS = require("../database/menus");
var CLIENTE = require("../database/cliente");
var ORDEN = require("../database/orden");

var jwt = require("jsonwebtoken");

router.post("/menus", (req, res) => {

   //Ejemplo de validacion
   var data = req.body;
   data ["registerdate"] = new Date();
   var newmenus = new MENUS(data);
   newmenus.save().then((rr) =>{
     res.status(200).json({
       "resp": 200,
       "dato": newmenus,
       "id" : rr._id,
       "msn" : "Menu agregado con exito"
     });
   });
 });
 
 router.get("/menus", (req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  MENUS.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.json({
      result : docs
    });
  });
});

router.get(/menus\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  MENUS.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(400).json({
      "respuesta":400,
      "msn" : "No existe el recurso seleccionado "
    });
  })
});

router.patch("/menus",(req, res) => {
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  var keys = Object.keys(params);
  var updatekeys = ["nombre", "precio", "descripcion", "foto"];
  var newkeys = [];
  var values = [];
  //seguridad
  for (var i  = 0; i < updatekeys.length; i++) {
    var index = keys.indexOf(updatekeys[i]);
    if (index != -1) {
        newkeys.push(keys[index]);
        values.push(params[keys[index]]);
    }
  }
  var objupdate = {}
  for (var i  = 0; i < newkeys.length; i++) {
      objupdate[newkeys[i]] = values[i];
  }
  console.log(objupdate);
  MENUS.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    res.status(200).json({
      "resp": 200,
      "dato": MENUS,
      "msn" : "Menu editado con exito"
    });
    return;
    
  });
});

//Actualiza los datos del restaurant
router.put(/menus\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys  = Object.keys(req.body);
  var oficialkeys = ['nombre', 'precio', 'descripcion'];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "No se puede actualizar error  utilice el formato patch"
    });
    return;
  }

  var menus = {
    tienda : req.body.tienda,
    nombre : req.body.nombre,
    precio : req.body.precio,
    descripcion : req.body.descripcion,
    foto : req.body.foto

  };
  MENUS.findOneAndUpdate({_id: id}, menus, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "No se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json({
        "resp": 200,
        "dato": MENUS,
        "msn" : "Menu editado con exito"
      });
      return;
  });
});

router.delete('/menus/:id', (req, res,) => {
  var idmenus = req.params.id;

  MENUS.findByIdAndRemove(idmenus).exec()
      .then(() => {
      res.status(200).json({
        "resp": 200,
        "msn" : "Eliminado con exito"
      });
      }).catch(err => {
          res.status(500).json({
              error: err
         
            });

      });
});

//Cliente

//Insertar datos de la orden
router.post("/orden",  (req, res) => {
  var data = req.body;
  data ["registerdate"] = new Date();
  var neworden = new ORDEN(data);
  neworden.save().then((rr) =>{
    res.status(200).json({
      "resp": 200,
      "dato": neworden,
      "msn" : "Orden agregado con exito"
    });
  });
});
router.get("/orden", (req, res, next) =>{
  ORDEN.find({}).populate("idmenu").populate("idrestaurant").populate("idcliente").exec((error, docs) => {
    res.status(200).json(docs);
  });
});

// Leer solo un usuario
router.get(/orden\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  ORDEN.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({

        "array_texto":
          {
            "texto":"<b>orden</b>",
            "texto":"Registrado con exito"
          }


    });
  })
});

//Actualizar solo x elementos
router.patch(/orden\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var orden = {};
  for (var i = 0; i < keys.length; i++) {
    orden[keys[i]] = req.body[keys[i]];
  }
  console.log(orden);
  ORDEN.findOneAndUpdate({_id: id}, orden, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json({
        "resp": 200,
        "dato": ORDEN,
        "msn" : "Orden editado con exito"
      });
      return;
  });
});

//Actualiza los datos de la orden
router.put(/orden\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys  = Object.keys(req.body);
  var oficialkeys = ['idmenu', 'idrestaurant', 'cantidad', 'idcliente', 'lat', 'lon', 'pagototal'];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "Existe un error en el formato de envio puede hacer uso del metodo patch si desea editar solo un fragmentode la informacion"
    });
    return;
  }

  var ORDEN = {
    menu : req.body.idmenu,
    restaurant : req.body.idtienda,
    cliente : req.body.idcliente,
    lugar_envio : req.body.lugar_envio,
    cantidad : req.body.cantidad,
    precio : req.body.precio,
    pagototal : req.body.pagototal
  };
  ORDEN.findOneAndUpdate({_id: id}, orden, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos de la orden"
        });
        return;
      }
      res.status(200).json({
        "resp": 200,
        "dato": ORDEN,
        "msn" : "Orden editado con exito"
      });
      return;
  });
});

//Elimina una orden
router.delete('/orden/:id', (req, res,) => {
  var idORDEN = req.params.id;

  ORDEN.findByIdAndRemove(idORDEN).exec()
      .then(() => {
          res.json({
              message: "Orden eliminada"
          });
      }).catch(err => {
          res.status(500).json({
              error: err
          });
      });
});

module.exports = router;