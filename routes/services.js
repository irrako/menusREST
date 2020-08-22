var express = require('express');
var router = express.Router();
var CATEGORIA = require("../database/categoria");

router.post("/categoria", (req, res) => {

   //Ejemplo de validacion
   var data = req.body;
   data ["registerdate"] = new Date();
   var newcategoria = new CATEGORIA(data);
   newcategoria.save().then((rr) =>{
     res.status(200).json({
       "resp": 200,
       "dato": newcategoria,
       "id" : rr._id,
       "msn" : "menu  agregado con exito"
     });
   });
 });
 
 router.get("/categoria", (req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  CATEGORIA.find({}).skip(skip).limit(limit).exec((err, docs) => {
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

router.get(/categoria\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  CATEGORIA.findOne({_id : id}).exec( (error, docs) => {
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

router.patch("/categoria",(req, res) => {
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
  CATEGORIA.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    res.status(200).json({
      "resp": 200,
      "dato": CATEGORIA,
      "msn" :  "Categoria  editado con exito"
    });
    return;
    
  });
});

router.delete('/categoria/:id', (req, res,) => {
  var idcategoria = req.params.id;

  CATEGORIA.findByIdAndRemove(idcategoria).exec()
      .then(() => {
      res.status(200).json({
        "resp": 200,
        "msn" : "eliminado con exito"
      });
      }).catch(err => {
          res.status(500).json({
              error: err
         
            });

      });
});

module.exports = router;