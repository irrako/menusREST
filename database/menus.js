const mongoose = require("./connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var MENUSSCHEMA = new mongoose.Schema({

    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    nombre: String,
    precio: {
        type: Number,
    },
    descripcion: String,
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },
    foto: String
});
//Nombre, precio, descripcion, fechaderegistro, fotografia del producto
var MENUS = mongoose.model("Menus", MENUSSCHEMA);
module.exports = MENUS;
