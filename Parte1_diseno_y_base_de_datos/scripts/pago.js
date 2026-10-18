// Página de pago: tarjeta o contra entrega

const ENVIO_ESTANDAR = 3;
const ENVIO_EXPRESS = 5;
const IMPUESTO = 0.10;

let tipoEnvio = 'estandar';
let formaPago = 'tarjeta';

// Si el carrito está vacío, no hay nada que pagar
if (cantidadTotal() === 0) {
  window.location.href = '/carrito.html';
}

// ---------- Totales ----------
function calcularTotales() {
  const subtotal = subtotalDelCarrito();

  let envio = ENVIO_ESTANDAR;
  if (tipoEnvio === 'express') {
    envio = ENVIO_EXPRESS;
  }

  const impuesto = subtotal * IMPUESTO;
  const total = subtotal + envio + impuesto;
  return { subtotal: subtotal, envio: envio, impuesto: impuesto, total: total };
}

function dibujarResumen() {
  const carrito = obtenerCarrito();

  let htmlPlatos = '';
  for (let i = 0; i < carrito.length; i++) {
    const plato = buscarPlato(carrito[i].id);
    if (plato !== null) {
      htmlPlatos = htmlPlatos +
        '<div class="linea"><span>' + plato.nombre + ' × ' + carrito[i].cantidad + '</span>' +
        '<span>' + dinero(plato.precio * carrito[i].cantidad) + '</span></div>';
    }
  }
  document.getElementById('platos-resumen').innerHTML = htmlPlatos;

  const totales = calcularTotales();
  document.getElementById('totales-resumen').innerHTML =
    '<div class="linea"><span>Subtotal</span><span>' + dinero(totales.subtotal) + '</span></div>' +
    '<div class="linea"><span>Envío</span><span>' + dinero(totales.envio) + '</span></div>' +
    '<div class="linea"><span>Impuestos (10%)</span><span>' + dinero(totales.impuesto) + '</span></div>' +
    '<div class="linea total"><span>Total</span><span>' + dinero(totales.total) + '</span></div>';
}

// ---------- Elegir envío y forma de pago ----------
// Pinta de naranja la opción que está elegida
function marcarOpciones() {
  const opciones = document.querySelectorAll('.opcion');
  for (let i = 0; i < opciones.length; i++) {
    const radio = opciones[i].querySelector('input');
    if (radio.checked) {
      opciones[i].classList.add('elegida');
    } else {
      opciones[i].classList.remove('elegida');
    }
  }
}

function elegirEnvio(tipo) {
  tipoEnvio = tipo;
  marcarOpciones();
  dibujarResumen();
}

function elegirPago(forma) {
  formaPago = forma;
  marcarOpciones();
  // Los datos de la tarjeta solo se ven si paga con tarjeta
  if (forma === 'tarjeta') {
    document.getElementById('datos-tarjeta').style.display = 'grid';
  } else {
    document.getElementById('datos-tarjeta').style.display = 'none';
  }
}

// ---------- Tarjeta ----------
// Deja solo los números de un texto (hasta un máximo de dígitos)
function soloNumeros(texto, maximo) {
  let resultado = '';
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] >= '0' && texto[i] <= '9' && resultado.length < maximo) {
      resultado = resultado + texto[i];
    }
  }
  return resultado;
}

// Escribe el número así: 4242 4242 4242 4242
function darFormatoTarjeta() {
  const campo = document.getElementById('numero-tarjeta');
  const numeros = soloNumeros(campo.value, 16);
  let resultado = '';
  for (let i = 0; i < numeros.length; i++) {
    if (i > 0 && i % 4 === 0) {
      resultado = resultado + ' ';
    }
    resultado = resultado + numeros[i];
  }
  campo.value = resultado;
}

// Escribe el vencimiento así: 12/30
function darFormatoVencimiento() {
  const campo = document.getElementById('vencimiento');
  const numeros = soloNumeros(campo.value, 4);
  if (numeros.length > 2) {
    campo.value = numeros.substring(0, 2) + '/' + numeros.substring(2);
  } else {
    campo.value = numeros;
  }
}

// Revisa que el número de tarjeta sea posible (método de Luhn)
function numeroDeTarjetaEsValido(numero) {
  let suma = 0;
  let duplicar = false;
  for (let i = numero.length - 1; i >= 0; i--) {
    let digito = Number(numero[i]);
    if (duplicar) {
      digito = digito * 2;
      if (digito > 9) {
        digito = digito - 9;
      }
    }
    suma = suma + digito;
    duplicar = !duplicar;
  }
  return suma % 10 === 0;
}

// Devuelve el texto del error, o null si la tarjeta está bien
function buscarErrorEnTarjeta() {
  const numero = soloNumeros(document.getElementById('numero-tarjeta').value, 19);
  if (numero.length < 13 || !numeroDeTarjetaEsValido(numero)) {
    return 'El número de tarjeta no es válido';
  }

  const partes = document.getElementById('vencimiento').value.split('/');
  if (partes.length !== 2 || partes[1].length !== 2) {
    return 'Escribe el vencimiento como MM/AA';
  }
  const mes = Number(partes[0]);
  const anio = 2000 + Number(partes[1]);
  if (isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12) {
    return 'El mes de vencimiento no es válido';
  }
  const ultimoDiaDelMes = new Date(anio, mes, 0, 23, 59);
  if (ultimoDiaDelMes < new Date()) {
    return 'La tarjeta está vencida';
  }

  const cvv = soloNumeros(document.getElementById('cvv').value, 4);
  if (cvv.length < 3) {
    return 'El código CVC no es válido';
  }
  return null;
}

// ---------- Revisar el formulario ----------
function buscarErrorEnFormulario() {
  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const correo = document.getElementById('correo').value.trim();

  if (nombre === '' || direccion === '' || telefono === '') {
    return 'Completa tu nombre, dirección y teléfono';
  }
  if (!correo.includes('@') || !correo.includes('.')) {
    return 'El correo electrónico no es válido';
  }
  if (formaPago === 'tarjeta') {
    return buscarErrorEnTarjeta();
  }
  return null;
}

// ---------- Enviar el pedido ----------
async function enviarPedido(evento) {
  evento.preventDefault();

  const textoError = document.getElementById('mensaje-error');
  const boton = document.querySelector('button[type="submit"]');

  const error = buscarErrorEnFormulario();
  if (error !== null) {
    textoError.textContent = error;
    return;
  }
  textoError.textContent = '';

  // Al servidor solo le mandamos el número del plato y la cantidad.
  // Los precios los pone el servidor con los de la base de datos.
  const carrito = obtenerCarrito();
  const platosParaServidor = [];
  const platosParaConfirmar = [];
  for (let i = 0; i < carrito.length; i++) {
    const plato = buscarPlato(carrito[i].id);
    platosParaServidor.push({ id: carrito[i].id, cantidad: carrito[i].cantidad });
    platosParaConfirmar.push({ nombre: plato.nombre, precio: plato.precio, cantidad: carrito[i].cantidad });
  }

  // De la tarjeta guardamos SOLO los últimos 4 números
  let ultimos4 = null;
  if (formaPago === 'tarjeta') {
    const numero = soloNumeros(document.getElementById('numero-tarjeta').value, 19);
    ultimos4 = numero.substring(numero.length - 4);
  }

  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();

  const pedidoParaServidor = {
    cliente: {
      nombre: nombre,
      direccion: direccion,
      correo: document.getElementById('correo').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      notas: document.getElementById('notas').value.trim()
    },
    platos: platosParaServidor,
    tipoEnvio: tipoEnvio,
    formaPago: formaPago,
    ultimos4: ultimos4
  };

  boton.disabled = true;
  boton.textContent = 'Procesando…';

  try {
    const respuesta = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoParaServidor)
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(datos.error);
    }

    // El número del pedido lo da la base de datos (con ceros: 00001)
    let codigo = String(datos.id);
    while (codigo.length < 5) {
      codigo = '0' + codigo;
    }

    // Guardamos lo necesario para mostrar la página de confirmación
    const totales = calcularTotales();
    const pedido = {
      codigo: codigo,
      nombre: nombre,
      direccion: direccion,
      tipoEnvio: tipoEnvio,
      formaPago: formaPago,
      ultimos4: ultimos4,
      platos: platosParaConfirmar,
      subtotal: totales.subtotal,
      envio: totales.envio,
      impuesto: totales.impuesto,
      total: datos.total
    };
    localStorage.setItem('ultimo_pedido', JSON.stringify(pedido));
    guardarCarrito([]);
    window.location.href = '/confirmacion.html';

  } catch (errorAlEnviar) {
    let mensaje = errorAlEnviar.message;
    if (errorAlEnviar.name === 'TypeError') {
      mensaje = 'No se pudo conectar con el servidor. Revisa que esté encendido.';
    }
    textoError.textContent = mensaje;
    boton.disabled = false;
    boton.textContent = 'Realizar Pedido';
  }
}

async function iniciar() {
  await cargarPlatos();
  dibujarResumen();
}

iniciar();