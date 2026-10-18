# 🍽️ La Esquina del Sabor

Sistema web de comida a domicilio. Los clientes ven el menú, filtran por categoría, arman su carrito y hacen su pedido con tarjeta o contra entrega. El servidor guarda los pedidos en una base de datos MySQL.

## Tecnologías

- **Frontend:** HTML5, CSS3 y JavaScript (fetch, localStorage)
- **Backend:** Node.js y Express 5
- **Base de datos:** MySQL (con el paquete `mysql2`)

## Requisitos

- [Node.js](https://nodejs.org) 20.6 o superior (el proyecto usa `node --env-file`)
- [XAMPP](https://www.apachefriends.org) o cualquier servidor MySQL/MariaDB

## Instalación

1. **Clona el repositorio** y entra a la carpeta:
   ```bash
   git clone https://github.com/Capa8-byte/la-esquina-del-sabor.git
   cd la-esquina-del-sabor
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Crea la base de datos.** Enciende MySQL en XAMPP, entra a phpMyAdmin (`http://localhost/phpmyadmin`) y:
   - Crea una base llamada `esquina_sabor` (cotejamiento `utf8mb4_general_ci`).
   - Entra a ella, pestaña **Importar**, y elige el archivo `.sql` de la carpeta `Parte1_diseno_y_base_de_datos/base_de_datos/`.

4. **Configura las variables de entorno.** Copia `.env.example` como `.env` y ajusta los valores si es necesario:
   ```
   DB_HOST=localhost
   DB_USUARIO=root
   DB_CLAVE=
   DB_NOMBRE=esquina_sabor
   ```
   En XAMPP, el usuario `root` normalmente no tiene contraseña.

## Ejecución

```bash
npm start
```

Abre **http://localhost:3000** en el navegador.

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Inicio: platos más pedidos y acceso por categoría |
| `/catalogo.html` | Catálogo con búsqueda, filtro por categoría y orden |
| `/catalogo.html?categoria=pizzas` | Catálogo ya filtrado por categoría |
| `/carrito.html` | Carrito de compras |
| `/pago.html` | Datos de entrega, tipo de envío y forma de pago |
| `/confirmacion.html` | Resumen del pedido realizado |

## API REST

### `GET /api/platos`

Devuelve la lista de platos activos, con su categoría y cuántas unidades se han pedido.

```json
[
  {
    "id": 1,
    "nombre": "Hamburguesa Gourmet",
    "descripcion": "Con queso fundido, lechuga fresca y tomate.",
    "precio": 12.5,
    "imagen": "/imagenes/hamburguesa_gourmet.jpg",
    "calificacion": 4.8,
    "tiempo": "15-20 min",
    "esPopular": true,
    "categoria": "hamburguesas",
    "categoriaNombre": "Hamburguesas",
    "vendidos": 3
  }
]
```

### `POST /api/pedidos`

Guarda un pedido nuevo. El servidor valida los datos y calcula el total con precios de la base de datos.

```json
{
  "cliente": {
    "nombre": "Ana López",
    "direccion": "6a Avenida 10-20, Zona 1",
    "telefono": "5555-5555",
    "correo": "ana@correo.com"
  },
  "platos": [
    { "id": 1, "cantidad": 2 },
    { "id": 4, "cantidad": 1 }
  ],
  "tipoEnvio": "estandar",
  "formaPago": "tarjeta",
  "ultimos4": "4242"
}
```

- `tipoEnvio`: `estandar` o `express`
- `formaPago`: `tarjeta` o `contra_entrega`
- `cantidad`: entre 1 y 50 por plato
- Solo se guardan los **últimos 4 dígitos** de la tarjeta.

**Respuesta (201):** `{ "id": 12, "total": 28.5 }`
**Errores:** `400` si faltan datos o son inválidos, `500` si falla el guardado.

### `GET /api/pedidos/:id`

Devuelve un pedido guardado con su detalle. Responde `404` si no existe.

## Estructura del proyecto

```
la_esquina_del_sabor/
├── start.js                          # Servidor Express (punto de entrada)
├── package.json
├── .env.example                      # Plantilla de variables de entorno
├── parte2_servidor/
│   ├── configuracion.js              # Lee el .env, impuesto y costos de envío
│   ├── conexion.js                   # Conexión a MySQL
│   ├── rutas_platos.js               # GET /api/platos
│   └── rutas_pedidos.js              # POST y GET /api/pedidos
└── Parte1_diseno_y_base_de_datos/
    ├── paginas/                      # Páginas HTML
    ├── estilos/                      # CSS
    ├── scripts/                      # JavaScript del navegador
    ├── imagenes/                     # Fotos de los platos y logo
    └── base_de_datos/                # Script SQL
```

## Probar el pago

La página de pago valida el número de tarjeta con el método de Luhn. Para probar, usa un número de prueba:

| Campo | Valor |
|---|---|
| Número | `4242 4242 4242 4242` |
| Vencimiento | cualquier fecha futura, por ejemplo `12/30` |
| CVC | `123` |

> No se realiza ningún cobro real: es un proyecto académico.

## Notas

- El archivo `.env` no se sube al repositorio porque contiene datos de conexión. Usa `.env.example` como guía.
- Las imágenes de los platos deben llamarse igual que en la columna `imagen` de la tabla `platos`: minúsculas, guiones bajos y extensión `.jpg` (por ejemplo, `/imagenes/hamburguesa_bbq.jpg`).
