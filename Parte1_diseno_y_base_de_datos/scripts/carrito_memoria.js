// El carrito se guarda en el navegador. Cada elemento es: { id: 1, cantidad: 2 }
const NOMBRE_CARRITO = 'carrito_esquina_sabor';

function dinero(numero) {
  return 'Q' + numero.toFixed(2);
}

function obtenerCarrito() {
  const texto = localStorage.getItem(NOMBRE_CARRITO);
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto);
}

function guardarCarrito(lista) {
  localStorage.setItem(NOMBRE_CARRITO, JSON.stringify(lista));
  mostrarContador();
}

// Cuántas unidades de un plato hay en el carrito
function cantidadDe(id) {
  const carrito = obtenerCarrito();
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      return carrito[i].cantidad;
    }
  }
  return 0;
}

// Total de unidades (el número que sale junto a "Carrito")
function cantidadTotal() {
  const carrito = obtenerCarrito();
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total = total + carrito[i].cantidad;
  }
  return total;
}

// AGREGAR un plato al carrito
function agregarAlCarrito(id) {
  const carrito = obtenerCarrito();
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      carrito[i].cantidad = carrito[i].cantidad + 1;
      guardarCarrito(carrito);
      return;
    }
  }
  carrito.push({ id: id, cantidad: 1 });
  guardarCarrito(carrito);
}

// AUMENTAR o DISMINUIR: pone una cantidad nueva. Si es 0, el plato se ELIMINA.
function cambiarCantidad(id, nuevaCantidad) {
  const carrito = obtenerCarrito();
  const nuevoCarrito = [];
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      if (nuevaCantidad <= 0) {
        continue; // no lo agregamos a la lista nueva: queda eliminado
      }
      carrito[i].cantidad = nuevaCantidad;
    }
    nuevoCarrito.push(carrito[i]);
  }
  guardarCarrito(nuevoCarrito);
}

// Suma de precio x cantidad de todo el carrito
function subtotalDelCarrito() {
  const carrito = obtenerCarrito();
  let subtotal = 0;
  for (let i = 0; i < carrito.length; i++) {
    const plato = buscarPlato(carrito[i].id);
    if (plato !== null) {
      subtotal = subtotal + plato.precio * carrito[i].cantidad;
    }
  }
  return subtotal;
}

// Actualiza el número "Carrito (N)" de la barra
function mostrarContador() {
  document.getElementById('contador').textContent = cantidadTotal();
}

mostrarContador();