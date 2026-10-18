// Página del catálogo: buscar, filtrar por categoría y ordenar los platos

let categoriaElegida = 'todos';
let textoBuscado = '';
let ordenElegido = 'popular';

// Si la dirección trae ?categoria=pizzas, el catálogo empieza en esa categoría
function leerCategoriaDeLaDireccion() {
  const parametros = new URLSearchParams(window.location.search);
  const clave = parametros.get('categoria');
  if (clave !== null) {
    categoriaElegida = clave;
  }
}

// Si la categoría de la dirección no existe, mostramos todo
function revisarCategoria() {
  if (categoriaElegida === 'todos') {
    return;
  }
  for (let i = 0; i < platos.length; i++) {
    if (platos[i].categoria === categoriaElegida && categoriaElegida !== 'extras') {
      return;
    }
  }
  categoriaElegida = 'todos';
}

// Los platos que se ven: según la categoría y lo que se escribió en el buscador
function platosDelCatalogo() {
  const lista = [];
  for (let i = 0; i < platos.length; i++) {
    const plato = platos[i];
    if (plato.categoria === 'extras') {
      continue;
    }
    const coincideCategoria = (categoriaElegida === 'todos' || plato.categoria === categoriaElegida);
    const textoDelPlato = (plato.nombre + ' ' + plato.descripcion).toLowerCase();
    const coincideBusqueda = textoDelPlato.includes(textoBuscado);

    if (coincideCategoria && coincideBusqueda) {
      lista.push(plato);
    }
  }

  // Ordenar
  if (ordenElegido === 'precio-menor') {
    lista.sort(function (a, b) { return a.precio - b.precio; });
  } else if (ordenElegido === 'precio-mayor') {
    lista.sort(function (a, b) { return b.precio - a.precio; });
  } else {
    // Más populares: los más pedidos primero; si empatan, mejor calificación
    lista.sort(function (a, b) {
      if (b.vendidos !== a.vendidos) {
        return b.vendidos - a.vendidos;
      }
      return b.calificacion - a.calificacion;
    });
  }
  return lista;
}

function botonCategoria(clave, nombre) {
  let clase = 'boton-categoria';
  if (clave === categoriaElegida) {
    clase = 'boton-categoria activo';
  }
  return '<button class="' + clase + '" onclick="elegirCategoria(\'' + clave + '\')">' + nombre + '</button>';
}

// Los botones de categoría salen de los propios platos de la base de datos
function dibujarCategorias() {
  const claves = [];
  const nombres = [];
  for (let i = 0; i < platos.length; i++) {
    const clave = platos[i].categoria;
    if (clave === 'extras') {
      continue;
    }
    if (!claves.includes(clave)) {
      claves.push(clave);
      nombres.push(platos[i].categoriaNombre);
    }
  }

  let html = botonCategoria('todos', 'Todo');
  for (let i = 0; i < claves.length; i++) {
    html = html + botonCategoria(claves[i], nombres[i]);
  }
  document.getElementById('categorias').innerHTML = html;
}

function dibujarCatalogo() {
  dibujarCategorias();

  const lista = platosDelCatalogo();
  document.getElementById('cantidad').textContent = '(' + lista.length + ' platos)';
  if (lista.length === 0) {
    document.getElementById('menu').innerHTML = '<p class="vacio">No encontramos platos con esa búsqueda.</p>';
  } else {
    dibujarLista('menu', lista);
  }

  dibujarListaExtras('extras', losExtras());
}

// ---------- Botones ----------
function elegirCategoria(clave) {
  categoriaElegida = clave;
  dibujarCatalogo();
}

function buscar() {
  textoBuscado = document.getElementById('buscador').value.toLowerCase();
  dibujarCatalogo();
}

function cambiarOrden() {
  ordenElegido = document.getElementById('orden').value;
  dibujarCatalogo();
}

function agregar(id) {
  agregarAlCarrito(id);
  dibujarCatalogo();
}

function subir(id) {
  cambiarCantidad(id, cantidadDe(id) + 1);
  dibujarCatalogo();
}

function bajar(id) {
  cambiarCantidad(id, cantidadDe(id) - 1);
  dibujarCatalogo();
}

async function iniciar() {
  try {
    leerCategoriaDeLaDireccion();
    await cargarPlatos();
    revisarCategoria();
    dibujarCatalogo();
  } catch (error) {
    document.getElementById('menu').innerHTML =
      '<p class="vacio">No se pudo cargar el catálogo. Revisa que el servidor y MySQL estén encendidos.</p>';
  }
}

iniciar();