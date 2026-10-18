const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

const carpeta = path.join(__dirname, 'Parte1_diseno_y_base_de_datos');

// Solo estas carpetas se entregan al navegador
app.use('/estilos', express.static(path.join(carpeta, 'estilos')));
app.use('/imagenes', express.static(path.join(carpeta, 'imagenes')));
app.use('/scripts', express.static(path.join(carpeta, 'scripts')));
app.use(express.static(path.join(carpeta, 'paginas')));

// Datos que usa la página (vienen de la base de datos)
app.use('/api/platos', require('./parte2_servidor/rutas_platos'));
app.use('/api/pedidos', require('./parte2_servidor/rutas_pedidos'));

app.get('/', function (req, res) {
  res.sendFile(path.join(carpeta, 'paginas', 'inicio.html'));
});

app.listen(3000, function () {
  console.log('Servidor encendido en http://localhost:3000');
});