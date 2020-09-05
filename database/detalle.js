const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var DETALLESCHEMA = new Schema({

  menus: {
  type: Schema.Types.ObjectId,
  ref: "Menus"
    },
  orden: {
  type: Schema.Types.ObjectId,
  ref: "Orden"
    },
  cantidad: Number,
  precio : Number 
});

var DETALLE = mongoose.model("Detalle", DETALLESCHEMA);
module.exports = DETALLE;