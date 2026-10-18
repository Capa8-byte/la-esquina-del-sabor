// Conexión a la base de datos
const mysql = require('mysql2/promise');
const configuracion = require('./configuracion');

const conexion = mysql.createPool({
  host: configuracion.baseDeDatos.host,
  user: configuracion.baseDeDatos.usuario,
  password: configuracion.baseDeDatos.clave,
  database: configuracion.baseDeDatos.nombre,
  charset: 'utf8mb4'
});

module.exports = conexion;