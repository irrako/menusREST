const mongoose = require("mongoose");
mongoose.connect("mongodb://192.168.32.2:27017/databasemenus", {useNewUrlParser: true});
var db = mongoose.connection;
db.on("error", () => {
  console.log("Error no se puede conectar al servidor");
});
  
db.on("open", () => {
  console.log("Conexion exitosa");
});
module.exports = mongoose;
