-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-10-2026 a las 05:48:52
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `esquina_sabor`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `clave` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `clave`) VALUES
(1, 'Hamburguesas', 'hamburguesas'),
(2, 'Pizzas', 'pizzas'),
(3, 'Tacos', 'tacos'),
(4, 'Ensaladas', 'ensaladas'),
(5, 'Postres', 'postres'),
(6, 'Bebidas', 'bebidas'),
(7, 'Extras', 'extras');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
CREATE TABLE `detalle_pedido` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `plato_id` int(11) NOT NULL,
  `nombre_plato` varchar(100) NOT NULL,
  `precio` decimal(8,2) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `notas` varchar(255) DEFAULT NULL,
  `tipo_envio` varchar(20) NOT NULL,
  `forma_pago` varchar(20) NOT NULL,
  `ultimos4` char(4) DEFAULT NULL,
  `subtotal` decimal(8,2) NOT NULL,
  `envio` decimal(8,2) NOT NULL,
  `impuesto` decimal(8,2) NOT NULL,
  `total` decimal(8,2) NOT NULL,
  `estado` varchar(20) DEFAULT 'recibido',
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platos`
--

DROP TABLE IF EXISTS `platos`;
CREATE TABLE `platos` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio` decimal(8,2) NOT NULL,
  `emoji` varchar(10) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `calificacion` decimal(2,1) DEFAULT 4.5,
  `tiempo` varchar(20) DEFAULT NULL,
  `es_popular` tinyint(1) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `platos`
--

INSERT INTO `platos` (`id`, `categoria_id`, `nombre`, `descripcion`, `precio`, `emoji`, `imagen`, `calificacion`, `tiempo`, `es_popular`, `activo`) VALUES
(1, 1, 'Hamburguesa Gourmet', 'Hamburguesa con queso fundido, lechuga fresca y tomate.', 12.50, '🍔', '/imagenes/hamburguesa_gourmet.jpg', 4.8, '15-20 min', 1, 1),
(2, 1, 'Hamburguesa BBQ', 'Carne a la parrilla con salsa BBQ ahumada y aros de cebolla.', 13.50, '🍔', '/imagenes/hamburguesa_bbq.jpg', 4.6, '18-22 min', 0, 1),
(3, 2, 'Pizza Pepperoni Clásica', 'Rebanada generosa de pepperoni con mozzarella premium.', 9.50, '🍕', '/imagenes/pizza.jpg', 4.7, '20-25 min', 1, 1),
(4, 2, 'Pizza Suprema', 'Pimientos, champiñones, aceitunas negras y cebolla roja.', 14.00, '🍕', '/imagenes/pizza_suprema.jpg', 4.4, '20-30 min', 0, 1),
(5, 3, 'Trío de Tacos Al Pastor', 'Tres tacos callejeros con piña, cilantro y cebolla.', 11.00, '🌮', '/imagenes/tacos_al_pastor.jpg', 4.9, '12-18 min', 1, 1),
(6, 3, 'Tacos de Pescado Baja', 'Pescado rebozado estilo Baja con col rallada.', 12.50, '🌮', '/imagenes/tacos_de_pescado_baja.jpg', 4.7, '15-20 min', 0, 1),
(7, 4, 'Ensalada Huerto Fresco', 'Mezcla de lechugas, tomates cherry y pepino.', 10.20, '🥗', '/imagenes/ensalada_huerto_fresco.jpg', 4.5, '10-15 min', 0, 1),
(8, 4, 'Bowl de Quinoa', 'Quinoa con aguacate, garbanzos y vegetales frescos.', 11.80, '🥗', '/imagenes/bowl_de_quinoa.jpg', 4.8, '10-15 min', 0, 1),
(15, 1, 'Hamburguesa Doble Queso', 'Doble carne, doble queso cheddar y pepinillos.', 15.50, '🍔', '/imagenes/hamburguesa_doble_queso.jpg', 4.7, '18-22 min', 0, 1),
(16, 2, 'Pizza Hawaiana', 'Jamón, piña y mozzarella.', 13.00, '🍕', '/imagenes/pizza_hawaiana.jpg', 4.3, '20-25 min', 0, 1),
(17, 3, 'Tacos de Pollo', 'Tres tacos de pollo asado con cilantro y limón.', 10.50, '🌮', '/imagenes/tacos_de_pollo.jpg', 4.5, '12-18 min', 0, 1),
(18, 4, 'Ensalada César', 'Lechuga romana, crutones, parmesano y aderezo césar.', 11.00, '🥗', '/imagenes/ensalada_cesar.jpg', 4.6, '10-15 min', 0, 1),
(19, 5, 'Pastel de Chocolate', 'Rebanada de pastel húmedo con cobertura de chocolate.', 8.50, '🍰', '/imagenes/pastel_de_chocolate.jpg', 4.9, '5 min', 0, 1),
(20, 5, 'Helado de Vainilla', 'Dos bolas de helado artesanal de vainilla.', 6.00, '🍨', '/imagenes/helado_de_vainilla.jpg', 4.6, '5 min', 0, 1),
(21, 5, 'Flan de Caramelo', 'Flan casero con salsa de caramelo.', 7.00, '🍮', '/imagenes/flan_de_caramelo.jpg', 4.5, '5 min', 0, 1),
(22, 6, 'Limonada Natural', 'Limonada fresca con hielo, hecha al momento.', 5.00, '🍋', '/imagenes/limonada_natural.jpg', 4.7, '5 min', 0, 1),
(23, 6, 'Gaseosa', 'Botella de gaseosa bien fría (350 ml).', 4.00, '🥤', '/imagenes/gaseosa.jpg', 4.4, '2 min', 0, 1),
(24, 6, 'Agua Pura', 'Botella de agua pura (500 ml).', 3.00, '💧', '/imagenes/agua_pura.jpg', 4.5, '2 min', 0, 1),
(25, 6, 'Café Americano', 'Café recién preparado, caliente.', 4.50, '☕', '/imagenes/cafe_americano.jpg', 4.6, '5 min', 0, 1),
(26, 7, 'Papas Fritas', 'Porción de papas fritas crujientes.', 6.00, '🍟', '/imagenes/papas_fritas.jpg', 4.8, '8 min', 0, 1),
(27, 7, 'Aros de Cebolla', 'Porción de aros de cebolla empanizados.', 6.50, '🧅', '/imagenes/aros_de_cebolla.jpg', 4.5, '8 min', 0, 1),
(28, 7, 'Queso Extra', 'Una porción extra de queso fundido.', 2.50, '🧀', NULL, 4.6, '1 min', 0, 1),
(29, 7, 'Tocino Extra', 'Una porción extra de tocino crujiente.', 3.00, '🥓', NULL, 4.7, '1 min', 0, 1),
(30, 7, 'Salsa BBQ', 'Vasito de salsa BBQ ahumada.', 1.50, '🥫', NULL, 4.4, '1 min', 0, 1),
(31, 7, 'Guacamol', 'Porción de guacamol fresco.', 4.00, '🥑', NULL, 4.7, '2 min', 0, 1),
(32, 7, 'Huevo Extra', 'Huevo frito para tu hamburguesa.', 2.00, '🥚', NULL, 4.5, '3 min', 0, 1),
(33, 7, 'Tortillas Extra', 'Cuatro tortillas calientes extra.', 2.00, '🌮', NULL, 4.6, '2 min', 0, 1),
(34, 7, 'Frijoles Volteados', 'Porción de frijoles volteados.', 3.50, '🥣', NULL, 4.6, '3 min', 0, 1),
(35, 7, 'Pan de Ajo', 'Tres rebanadas de pan con ajo y mantequilla.', 5.00, '🥖', NULL, 4.4, '6 min', 0, 1),
(36, 7, 'Salsa Picante', 'Vasito de salsa picante de la casa.', 1.00, '🌶️', NULL, 4.5, '1 min', 0, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clave` (`clave`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `plato_id` (`plato_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `platos`
--
ALTER TABLE `platos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `platos`
--
ALTER TABLE `platos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`plato_id`) REFERENCES `platos` (`id`);

--
-- Filtros para la tabla `platos`
--
ALTER TABLE `platos`
  ADD CONSTRAINT `platos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
