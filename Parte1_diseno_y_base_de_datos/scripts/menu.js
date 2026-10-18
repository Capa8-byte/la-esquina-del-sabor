// Página de inicio: los más pedidos y accesos al catálogo

// Los 4 platos más pedidos (sin contar los extras)
function losMasPedidos() {
  const lista = [];
  for (let i = 0; i < platos.length; i++) {
    if (platos[i].categoria !== 'extras') {
      lista.push(platos[i]);
    }
  }

  // Primero los que más se han pedido. Si empatan, el de mejor calificación.
  lista.sort(function (a, b) {
    if (b.vendidos !== a.vendidos) {
      return b.vendidos - a.vendidos;
    }
    return b.calificacion - a.calificacion;
  });

  return lista.slice(0, 4);
}

// Un botón por categoría: lleva al catálogo ya filtrado
function dibujarCategorias() {
  const claves = [];
  let html = '';
  for (let i = 0; i < platos.length; i++) {
    const clave = platos[i].categoria;
    if (clave === 'extras' || claves.includes(clave)) {
      continue;
    }
    claves.push(clave);
    html = html + '<a class="boton-categoria" href="/catalogo.html?categoria=' + clave + '">' +
           platos[i].categoriaNombre + '</a>';
  }
  document.getElementById('categorias').innerHTML = html;
}

function dibujarInicio() {
  dibujarLista('mas-pedidos', losMasPedidos());
  dibujarCategorias();
}

function agregar(id) {
  agregarAlCarrito(id);
  dibujarInicio();
}

function subir(id) {
  cambiarCantidad(id, cantidadDe(id) + 1);
  dibujarInicio();
}

function bajar(id) {
  cambiarCantidad(id, cantidadDe(id) - 1);
  dibujarInicio();
}

async function iniciar() {
  try {
    await cargarPlatos();
    dibujarInicio();
  } catch (error) {
    document.getElementById('mas-pedidos').innerHTML =
      '<p class="vacio">No se pudo cargar el menú. Revisa que el servidor y MySQL estén encendidos.</p>';
  }
}

iniciar();