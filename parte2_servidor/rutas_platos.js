// GET /api/platos -> la lista de platos del menú (viene de la base de datos)
const express = require('express');
const conexion = require('./conexion');
const router = express.Router();

router.get('/', async function (req, res) {
  try {
    // "vendidos" cuenta cuántas unidades de cada plato se han pedido
    const resultado = await conexion.query(
      'SELECT p.id, p.nombre, p.descripcion, p.precio, p.emoji, p.imagen, p.calificacion, p.tiempo, ' +
      'p.es_popular, c.clave AS categoria, c.nombre AS categoria_nombre, ' +
      '(SELECT COALESCE(SUM(d.cantidad), 0) FROM detalle_pedido d WHERE d.plato_id = p.id) AS vendidos ' +
      'FROM platos p JOIN categorias c ON c.id = p.categoria_id ' +
      'WHERE p.activo = TRUE ORDER BY p.id');
    const filas = resultado[0];

    const platos = [];
    for (let i = 0; i < filas.length; i++) {
      platos.push({
        id: filas[i].id,
        nombre: filas[i].nombre,
        descripcion: filas[i].descripcion,
        precio: Number(filas[i].precio),
        emoji: filas[i].emoji,
        imagen: filas[i].imagen,
        calificacion: Number(filas[i].calificacion),
        tiempo: filas[i].tiempo,
        esPopular: Boolean(filas[i].es_popular),
        categoria: filas[i].categoria,
        categoriaNombre: filas[i].categoria_nombre,
        vendidos: Number(filas[i].vendidos)
      });
    }
    res.json(platos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo cargar el menú' });
  }
});

module.exports = router;