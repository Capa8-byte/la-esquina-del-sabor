// Dibuja la página del carrito
const ENVIO = 3;
const IMPUESTO = 0.10;

function dibujarCarrito() {
  const carrito = obtenerCarrito();

  // Si no hay nada en el carrito
  if (carrito.length === 0) {
    document.getElementById('lista').innerHTML =
      '<div class="vacio">🛒<br>Tu carrito está vacío.<br><br><a class="boton" href="/">Ver el menú</a></div>';
    document.getElementById('resumen').style.display = 'none';
    return;
  }
  document.getElementById('resumen').style.display = 'block';

  // Una fila por cada plato
  let html = '';
  for (let i = 0; i < carrito.length; i++) {
    const plato = buscarPlato(carrito[i].id);
    if (plato === null) {
      continue;
    }
    const cantidad = carrito[i].cantidad;

    html = html +
      '<div class="fila-plato">' +
        '<img src="' + plato.imagen + '" alt="' + plato.nombre + '">' +
        '<div class="datos">' +
          '<b>' + plato.nombre + '</b><br>' +
          '<small>' + dinero(plato.precio) + ' / ud.</small>' +
        '</div>' +
        '<div class="selector">' +
          '<button onclick="bajar(' + plato.id + ')">−</button>' +
          '<b>' + cantidad + '</b>' +
          '<button onclick="subir(' + plato.id + ')">+</button>' +
        '</div>' +
        '<b class="subtotal-plato">' + dinero(plato.precio * cantidad) + '</b>' +
        '<button class="basurero" onclick="quitar(' + plato.id + ')" title="Quitar">🗑️</button>' +
      '</div>';
  }
  document.getElementById('lista').innerHTML = html;

  // Resumen con los totales
  const subtotal = subtotalDelCarrito();
  const impuesto = subtotal * IMPUESTO;
  const total = subtotal + ENVIO + impuesto;

  document.getElementById('lineas-resumen').innerHTML =
    '<div class="linea"><span>Subtotal</span><span>' + dinero(subtotal) + '</span></div>' +
    '<div class="linea"><span>Envío</span><span>' + dinero(ENVIO) + '</span></div>' +
    '<div class="linea"><span>Impuestos (10%)</span><span>' + dinero(impuesto) + '</span></div>' +
    '<div class="linea total"><span>Total</span><span>' + dinero(total) + '</span></div>';
}

function subir(id) {
  cambiarCantidad(id, cantidadDe(id) + 1);
  dibujarCarrito();
}

function bajar(id) {
  cambiarCantidad(id, cantidadDe(id) - 1);
  dibujarCarrito();
}

function quitar(id) {
  cambiarCantidad(id, 0);
  dibujarCarrito();
}

async function iniciar() {
  await cargarPlatos();
  dibujarCarrito();
}

iniciar();