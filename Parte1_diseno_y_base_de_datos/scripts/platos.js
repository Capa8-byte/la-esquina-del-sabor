// Lista de platos: se pide al servidor (viene de la base de datos)
let platos = [];

async function cargarPlatos() {
  const respuesta = await fetch('/api/platos');
  platos = await respuesta.json();
}

// Busca un plato por su número (id)
function buscarPlato(id) {
  for (let i = 0; i < platos.length; i++) {
    if (platos[i].id === id) {
      return platos[i];
    }
  }
  return null;
}