// Cómo se dibuja la tarjeta de un plato (lo usan el inicio y el carrito)

// Si el plato tiene foto se muestra la foto; si no, su emoji
function dibujarFoto(plato) {
  if (plato.imagen) {
    return '<img src="' + plato.imagen + '" alt="' + plato.nombre + '">';
  }
  return '<div class="foto-emoji">' + plato.emoji + '</div>';
}

// Si el plato no está en el carrito se ve "Añadir"; si ya está, el selector  −  2  +
function dibujarControl(plato) {
  const cantidad = cantidadDe(plato.id);

  if (cantidad === 0) {
    return '<button class="boton" onclick="agregar(' + plato.id + ')">Añadir</button>';
  }
  return '<div class="selector">' +
           '<button onclick="bajar(' + plato.id + ')">−</button>' +
           '<b>' + cantidad + '</b>' +
           '<button onclick="subir(' + plato.id + ')">+</button>' +
         '</div>';
}

function dibujarTarjeta(plato) {
  let textoPedidos = '';
  if (plato.vendidos > 0) {
    textoPedidos = ' · 🔥 ' + plato.vendidos + ' pedidos';
  }

  return '<article class="tarjeta">' +
           dibujarFoto(plato) +
           '<div class="tarjeta-cuerpo">' +
             '<h3>' + plato.nombre + '</h3>' +
             '<p>' + plato.descripcion + '</p>' +
             '<small>⭐ ' + plato.calificacion + ' · ⏱ ' + plato.tiempo + textoPedidos + '</small>' +
             '<div class="tarjeta-pie">' +
               '<span class="precio">' + dinero(plato.precio) + '</span>' +
               dibujarControl(plato) +
             '</div>' +
           '</div>' +
         '</article>';
}

// Dibuja una lista de platos dentro de un lugar de la página
function dibujarLista(idLugar, lista) {
  let html = '';
  for (let i = 0; i < lista.length; i++) {
    html = html + dibujarTarjeta(lista[i]);
  }
  document.getElementById(idLugar).innerHTML = html;
}
// Los extras tienen su propio diseño: una fila compacta con foto redonda (o emoji)
function dibujarTarjetaExtra(plato) {
  let foto = '<div class="extra-emoji">' + plato.emoji + '</div>';
  if (plato.imagen) {
    foto = '<img class="extra-foto" src="' + plato.imagen + '" alt="' + plato.nombre + '">';
  }

  // Si ya está en el carrito, la fila se marca con borde naranja
  let clase = 'extra';
  if (cantidadDe(plato.id) > 0) {
    clase = 'extra elegido';
  }

  return '<div class="' + clase + '">' +
           foto +
           '<div class="extra-datos">' +
             '<b>' + plato.nombre + '</b>' +
             '<small>' + plato.descripcion + '</small>' +
             '<span class="extra-precio">+ ' + dinero(plato.precio) + '</span>' +
           '</div>' +
           dibujarControl(plato) +
         '</div>';
}

// Dibuja la lista de extras dentro de un lugar de la página
function dibujarListaExtras(idLugar, lista) {
  let html = '';
  for (let i = 0; i < lista.length; i++) {
    html = html + dibujarTarjetaExtra(lista[i]);
  }
  document.getElementById(idLugar).innerHTML = html;
}
// Solo los extras (papas, queso extra, salsas...)
function losExtras() {
  const lista = [];
  for (let i = 0; i < platos.length; i++) {
    if (platos[i].categoria === 'extras') {
      lista.push(platos[i]);
    }
  }
  return lista;
}