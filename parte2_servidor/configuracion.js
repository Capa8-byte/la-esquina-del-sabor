// Los datos de conexión se leen del archivo .env
module.exports = {
  baseDeDatos: {
    host: process.env.DB_HOST || 'localhost',
    usuario: process.env.DB_USUARIO || 'root',
    clave: process.env.DB_CLAVE || '',
    nombre: process.env.DB_NOMBRE || 'esquina_sabor'
  },
  impuesto: 0.10,
  envioEstandar: 3,
  envioExpress: 5
};