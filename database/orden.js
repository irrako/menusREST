const mongoose = require("./connect");//PEDIDOS
var mon = require('mongoose');
var Schema = mon.Schema;
var ORDENSCHEMA = new mongoose.Schema({

    idmenus: {
        type: Schema.Types.ObjectId,
        ref: "Menus"
        },
      
    idrestaurant:{
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
        },
    idcliente : {
        type: Schema.Types.ObjectId,
        ref: "Cliente"
        },
    cantidad : Number,
    lat : String,
    long : String,
    Fecha_Registro:
          {
            type:Date,
            default: Date.now()
          },
    pago_total : Number,
      });

    var ORDEN = mongoose.model("Orden", ORDENSCHEMA);
    module.exports = ORDEN;
      