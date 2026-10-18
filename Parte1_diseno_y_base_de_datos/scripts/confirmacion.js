// Página de pedido confirmado: muestra el último pedido guardado

// Evita que un texto raro escrito por el cliente dañe la página
function textoSeguro(texto) {
  const caja = document.createElement('div');
  caja.textContent = texto;
  return caja.innerHTML;
}

function mostrarPedido() {
  const lugar = document.getElementById('detalle-pedido');
  const texto = localStorage.getItem('ultimo_pedido');

  // Si alguien entra aquí sin haber hecho un pedido
  if (texto === null) {
    lugar.innerHTML = '<p class="vacio">Todavía no has hecho ningún pedido.</p>';
    return;
  }
  const pedido = JSON.parse(texto);

  document.getElementById('codigo-pedido').textContent = '#SR-' + pedido.codigo;

  // Tiempo según el tipo de envío
  if (pedido.tipoEnvio === 'express') {
    document.getElementById('tiempo-estimado').textContent = '15 - 25 min';
  } else {
    document.getElementById('tiempo-estimado').textContent = '30 - 45 min';
  }

  // Forma de pago
  let textoPago = 'Pago contra entrega';
  let textoTotal = 'Total a pagar al recibir';
  if (pedido.formaPago === 'tarjeta') {
    textoPago = 'Tarjeta •••• ' + pedido.ultimos4;
    textoTotal = 'Total pagado';
  }

  // Lista de platos
  let htmlPlatos = '';
  for (let i = 0; i < pedido.platos.length; i++) {
    const plato = pedido.platos[i];
    htmlPlatos = htmlPlatos +
      '<div class="linea"><span>' + plato.cantidad + '× ' + plato.nombre + '</span>' +
      '<b>' + dinero(plato.precio * plato.cantidad) + '</b></div>';
  }

  lugar.innerHTML =
    '<div class="datos-entrega">' +
      '<small>📍 DIRECCIÓN DE ENTREGA</small>' +
      '<p>' + textoSeguro(pedido.nombre) + '<br>' + textoSeguro(pedido.direccion) + '</p>' +
      '<small>💳 FORMA DE PAGO</small>' +
      '<p>' + textoPago + '</p>' +
    '</div>' +
    htmlPlatos +
    '<div class="linea"><span>Subtotal</span><span>' + dinero(pedido.subtotal) + '</span></div>' +
    '<div class="linea"><span>Envío</span><span>' + dinero(pedido.envio) + '</span></div>' +
    '<div class="linea"><span>Impuestos</span><span>' + dinero(pedido.impuesto) + '</span></div>' +
    '<div class="linea total"><span>' + textoTotal + '</span><span>' + dinero(pedido.total) + '</span></div>';
}

mostrarPedido();