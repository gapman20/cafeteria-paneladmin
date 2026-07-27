# Actualización del Panel de Administración y Sistema de Pedidos - Café de Especialidad

## 1. Introducción
La presente actualización tuvo como objetivo principal llevar a cabo un rediseño integral de la aplicación web, transformando la interfaz en una experiencia visual de lujo orientada a una cafetería de especialidad (estética "Dark Luxury" o "Roma Brew"). Se priorizó una navegación moderna, fluida y con micro-interacciones. A la par del diseño, se implementaron diversas funcionalidades clave para optimizar el flujo de pedidos de los clientes, como validación estricta de GPS, envío automatizado de pedidos vía WhatsApp, una nueva pantalla de éxito simulando un ticket impreso, y mejoras significativas en la experiencia de usuario (UX) para dispositivos móviles.

## 2. Construcción de Vistas en React y Hooks Utilizados
El sistema fue estructurado utilizando componentes funcionales de React, aprovechando ampliamente la API de Hooks para el manejo de estado, efectos secundarios y lógica compartida.

**Vistas Principales:**
*   **`Home.jsx`**: Landing page principal con información del negocio. Se implementó un redireccionamiento automático (`useEffect`) para usuarios que ingresan escaneando un código QR con el parámetro `?mesa=XX`, llevándolos directamente a la vista de pedidos.
*   **`Order.jsx`**: Pantalla central del sistema (Arma tu pedido). Se rediseñó para incluir:
    *   Formulario de cliente validado.
    *   Verificación de cobertura por GPS utilizando la API de geolocalización nativa del navegador y la fórmula de Haversine para calcular distancias.
    *   Generación de un "Ticket" visual al finalizar la orden, optimizado para impresión térmica (`window.print()`).
    *   Formateo en tiempo real del número telefónico a formato de 10 dígitos (`XX XXXX XXXX`).
*   **`Contact.jsx`**: Vista de información de contacto corporativo y mapa. Rediseñada con CSS Grid responsivo (`auto-fit`).
*   **`Menu.jsx`** y **`Gallery.jsx`**: Presentación del catálogo con revelado al hacer scroll (Scroll Reveal).

**Hooks Utilizados:**
*   **Nativos de React**: `useState` (estado local para formularios y modales), `useEffect` (side-effects como redireccionamientos y listeners de scroll), `useCallback` (memorización de funciones como validadores y manejadores de eventos), `useMemo` (cálculos costosos o filtros).
*   **React Router**: `useNavigate` (navegación programática), `useSearchParams` (extracción de parámetros como la mesa desde la URL).
*   **Hooks Personalizados (Custom Hooks)**:
    *   `useSite()`: Contexto global (SiteContext) que provee datos del negocio, carrito y configuración temática.
    *   `useScrollReveal()`: Hook para inyectar clases CSS basadas en la intersección del usuario con la pantalla (`IntersectionObserver`), logrando animaciones suaves de entrada.

## 3. Estructura de Archivos Modificados / Creados
A continuación se detalla la jerarquía principal de los archivos que fueron tocados durante la actualización:

```text
cafeteria-paneladmin/
├── README.md
├── README_Marco.md                  <-- [NUEVO] Este documento de registro
├── src/
│   ├── index.css                    <-- Refactor total: Paleta oscura, utilidades, animaciones y media queries
│   ├── App.jsx                      <-- Configuración de enrutamiento y layout principal
│   ├── components/
│   │   ├── Navbar.jsx               <-- Reconstruido para diseño premium
│   │   ├── Footer.jsx               <-- Información de contacto e indexación de páginas
│   │   ├── LocationMap.jsx          <-- Integración de Leaflet/OpenStreetMap
│   │   ├── WhatsAppButton.jsx       <-- Botón flotante de contacto
│   │   ├── RomaBrewHero.jsx         <-- Sección inicial atractiva (Hero)
│   │   └── DrinkCustomizer.jsx      <-- Modal para personalizar productos (tamaño, tipo de leche)
│   ├── context/
│   │   └── SiteContext.jsx          <-- Lógica global: carrito, inventario en memoria y variables del negocio
│   ├── hooks/
│   │   └── useScrollReveal.js       <-- Lógica del Intersection Observer
│   └── pages/
│       ├── Home.jsx                 <-- Landing page con redirección QR
│       ├── Order.jsx                <-- Lógica central de carrito, GPS, y ticket impreso
│       ├── Menu.jsx                 <-- Listado de productos
│       └── Contact.jsx              <-- Formularios de contacto y ubicación
```

## 4. Historial de Errores y Soluciones Detalladas

Durante la jornada de desarrollo se presentaron diversos obstáculos que fueron solucionados progresivamente:

1.  **Error de Compilación por Componente Faltante**
    *   *Problema:* Al unificar el layout, la aplicación colapsó porque el componente `Navbar` estaba siendo referenciado en `App.jsx` pero el archivo físico no existía.
    *   *Solución:* Se creó rápidamente el archivo `src/components/Navbar.jsx` con los enlaces correctos usando `react-router-dom`, resolviendo el error del bundler.

2.  **Validación de GPS: El botón se inhabilitaba tras verificar la ubicación**
    *   *Problema:* El flujo dictaba que el botón de envío debía estar bloqueado hasta verificar el GPS. Sin embargo, al dar clic en validar y tener una lectura exitosa, el sistema escribía "Para llevar / Pasar a recoger" en el campo de dirección. El problema era que modificar la dirección disparaba el detector de cambios (`updateCustomer`), el cual reseteaba internamente el estado de validación a `unverified`, volviendo a bloquear el botón.
    *   *Solución:* Se refactorizó la función `verifyCoverageByGPS` en `Order.jsx`. En lugar de llamar a `updateCustomer`, se inyectó el cambio directamente en el estado del carrito (`setCart(prev => ...)`) sin disparar el reseteo del estatus del GPS.

3.  **Ilusión Óptica del Error de GPS Persistente**
    *   *Problema:* Si el usuario intentaba enviar el pedido sin GPS, salía un recuadro rojo. Tras validar el GPS, el botón se activaba, pero el recuadro rojo no desaparecía, confundiendo al usuario.
    *   *Solución:* Se forzó la limpieza del mensaje de error de cobertura (`setCoverageMsg('')`) en el momento en que la validación era exitosa.

4.  **Botón de Enviar Pedido sin Estado Visual de "Deshabilitado"**
    *   *Problema:* El botón estaba lógicamente deshabilitado pero visualmente seguía luciendo de color sólido y con cursor clickeable.
    *   *Solución:* Se agregó la pseudo-clase `.btn-primary:disabled` en `index.css` aplicando opacidad, removiendo sombras y cambiando el cursor a `not-allowed`.

5.  **Rebote de Vista en Móvil al dar "Nueva Orden"**
    *   *Problema:* En la versión celular, al estar en el ticket de éxito y presionar "Nueva Orden", el carrito se vaciaba pero el panel lateral derecho (drawer del carrito) se quedaba abierto en pantalla mostrando el mensaje "Tu carrito está vacío", tapando el menú.
    *   *Solución:* Se inyectó la instrucción `setMobileCartOpen(false)` en el `onClick` del botón "Nueva Orden" para forzar el cierre del modal.

6.  **Desborde Horizontal en la Vista de Contacto (Responsive)**
    *   *Problema:* La vista `/contacto` tenía dos columnas fijas en su CSS en línea (`gridTemplateColumns: minmax(300px, 1fr) minmax(300px, 1fr)`). En móviles, forzaba al usuario a hacer scroll horizontal rompiendo la estética.
    *   *Solución:* Se actualizó la propiedad a CSS Grid dinámico: `gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'`. Con esto el navegador envía el formulario abajo del mapa cuando la pantalla es estrecha.

7.  **Botón de WhatsApp Flotante Obstructivo en Celulares**
    *   *Problema:* El globo verde fijo en la esquina inferior derecha tapaba información vital de la barra flotante del carrito.
    *   *Solución:* Se aplicó un Media Query en `index.css` (`@media screen and (max-width: 768px)`) añadiendo `display: none !important;` a la clase `.whatsapp-float`.

8.  **Formateo Inconsistente del Número de Teléfono**
    *   *Problema:* El ticket necesitaba que el teléfono fuera legible y exacto en 10 dígitos. Los usuarios podían escribir números juntos o incluir ladas internacionales.
    *   *Solución:* Se construyó una función de auto-formateo directo en el `onChange` del input que intercepta lo tecleado, elimina todo lo que no sea número mediante Expresiones Regulares (`replace(/\D/g, '')`), lo recorta a 10 caracteres e inyecta espacios automáticamente bajo la máscara lógica `XX XXXX XXXX`.

9.  **Ticket de Confirmación Impreso Deficiente**
    *   *Problema:* Al mandar a imprimir el recibo virtual, salía la interfaz completa (navegación, fondo oscuro brillante, botones, URLs y números de página del navegador), gastando tinta inútilmente.
    *   *Solución:* Se generó una hoja de estilos de impresión estricta (`@media print`) y `@page { margin: 0; }`. Se forzó el fondo a blanco y el texto a negro, ocultando `.navbar`, `header`, `footer` y configurando un `width: 380px` para que se ajustara elegantemente al tamaño de un ticket real sin estirarse al ancho de la hoja A4. Se agregaron recortes circulares para simular un verdadero ticket de papel.
