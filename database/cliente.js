const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var CLIENTESCHEMA = new mongoose.Schema({
  nombre : String,
  ci : String,
  telefono : Number,
  email : String,
  password : String,
  Fecha_Registro: {
      type: Date,
      default: Date.now()
  },
  tipo : String
});
var CLIENTE = mongoose.model("Cliente", CLIENTESCHEMA);
module.exports = CLIENTE;
