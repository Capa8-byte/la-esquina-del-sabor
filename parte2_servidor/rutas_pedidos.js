// POST /api/pedidos      -> guarda un pedido nuevo
// GET  /api/pedidos/:id  -> consulta un pedido guardado
const express = require('express');
const conexion = require('./conexion');
const configuracion = require('./configuracion');
const router = express.Router();

function redondear(numero) {
  return Math.round(numero * 100) / 100;
}

function esTexto(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

// Revisa los datos. Devuelve el texto del error, o null si todo está bien.
function buscarError(datos) {
  if (!datos || !datos.cliente) {
    return 'Faltan los datos del cliente';
  }
  const cliente = datos.cliente;
  if (!esTexto(cliente.nombre) || !esTexto(cliente.direccion) || !esTexto(cliente.telefono)) {
    return 'Completa tu nombre, dirección y teléfono';
  }
  if (!esTexto(cliente.correo) || !cliente.correo.includes('@') || !cliente.correo.includes('.')) {
    return 'El correo electrónico no es válido';
  }
  if (!Array.isArray(datos.platos) || datos.platos.length === 0) {
    return 'El carrito está vacío';
  }
  for (let i = 0; i < datos.platos.length; i++) {
    const plato = datos.platos[i];
    if (!Number.isInteger(plato.id) || !Number.isInteger(plato.cantidad)) {
      return 'Hay un plato con datos inválidos';
    }
    if (plato.cantidad < 1 || plato.cantidad > 50) {
      return 'La cantidad de cada plato debe estar entre 1 y 50';
    }
  }
  if (datos.tipoEnvio !== 'estandar' && datos.tipoEnvio !== 'express') {
    return 'El tipo de envío no es válido';
  }
  if (datos.formaPago !== 'tarjeta' && datos.formaPago !== 'contra_entrega') {
    return 'La forma de pago no es válida';
  }
  if (datos.formaPago === 'tarjeta' && String(datos.ultimos4).length !== 4) {
    return 'Los datos de la tarjeta no son válidos';
  }
  return null;
}

function buscarPlatoPorId(lista, id) {
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === id) {
      return lista[i];
    }
  }
  return null;
}

router.post('/', async function (req, res) {
  const datos = req.body;

  const error = buscarError(datos);
  if (error !== null) {
    return res.status(400).json({ error: error });
  }

  let miConexion = null;
  try {
    miConexion = await conexion.getConnection();

    // 1. Buscar los precios REALES en la base de datos (no confiamos en el navegador)
    const ids = [];
    for (let i = 0; i < datos.platos.length; i++) {
      ids.push(datos.platos[i].id);
    }
    const resultado = await miConexion.query('SELECT id, nombre, precio FROM platos WHERE id IN (?)', [ids]);
    const platosEnBase = resultado[0];

    // 2. Calcular los totales
    let subtotal = 0;
    for (let i = 0; i < datos.platos.length; i++) {
      const plato = buscarPlatoPorId(platosEnBase, datos.platos[i].id);
      if (plato === null) {
        return res.status(400).json({ error: 'Uno de los platos no existe' });
      }
      subtotal = subtotal + Number(plato.precio) * datos.platos[i].cantidad;
    }
    subtotal = redondear(subtotal);

    let envio = configuracion.envioEstandar;
    if (datos.tipoEnvio === 'express') {
      envio = configuracion.envioExpress;
    }
    const impuesto = redondear(subtotal * configuracion.impuesto);
    const total = redondear(subtotal + envio + impuesto);

    let ultimos4 = null;
    if (datos.formaPago === 'tarjeta') {
      ultimos4 = String(datos.ultimos4);
    }

    // 3. Guardar el pedido y sus platos (si algo falla, no se guarda nada)
    await miConexion.beginTransaction();
    try {
      const cliente = datos.cliente;
      const guardado = await miConexion.query(
        'INSERT INTO pedidos (nombre_cliente, correo, telefono, direccion, notas, tipo_envio, ' +
        'forma_pago, ultimos4, subtotal, envio, impuesto, total) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [cliente.nombre, cliente.correo, cliente.telefono, cliente.direccion, cliente.notas || null,
         datos.tipoEnvio, datos.formaPago, ultimos4, subtotal, envio, impuesto, total]);
      const idPedido = guardado[0].insertId;

      for (let i = 0; i < datos.platos.length; i++) {
        const plato = buscarPlatoPorId(platosEnBase, datos.platos[i].id);
        await miConexion.query(
          'INSERT INTO detalle_pedido (pedido_id, plato_id, nombre_plato, precio, cantidad) VALUES (?,?,?,?,?)',
          [idPedido, plato.id, plato.nombre, plato.precio, datos.platos[i].cantidad]);
      }

      await miConexion.commit();
      res.status(201).json({ id: idPedido, total: total });
    } catch (errorAlGuardar) {
      await miConexion.rollback();
      throw errorAlGuardar;
    }

  } catch (errorGrave) {
    console.error(errorGrave);
    res.status(500).json({ error: 'No se pudo guardar el pedido' });
  } finally {
    if (miConexion !== null) {
      miConexion.release();
    }
  }
});

router.get('/:id', async function (req, res) {
  try {
    const resultado = await conexion.query('SELECT * FROM pedidos WHERE id = ?', [req.params.id]);
    if (resultado[0].length === 0) {
      return res.status(404).json({ error: 'No encontramos ese pedido' });
    }
    const pedido = resultado[0][0];
    const platos = await conexion.query(
      'SELECT nombre_plato, precio, cantidad FROM detalle_pedido WHERE pedido_id = ?', [req.params.id]);
    pedido.platos = platos[0];
    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo cargar el pedido' });
  }
});

module.exports = router;