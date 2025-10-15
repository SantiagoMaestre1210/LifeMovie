# LifeMovie - Mi Película de Vida

### Descripción General
LifeMovie es una herramienta digital interactiva avanzada diseñada para ayudar a los usuarios a crear y visualizar su propia “película de vida”, gestionando de forma integral sus metas personales. Presenta un diseño minimalista, relajante y motivador, con un sistema de categorías, estadísticas, filtros, modo oscuro, exportación de datos y animaciones de celebración. El proyecto busca ofrecer una experiencia premium, intuitiva y segura para establecer y seguir metas, funcionando completamente con **JavaScript puro, HTML5 y CSS3**, sin dependencias ni frameworks externos.

### Preferencias del Usuario
Prefiero un lenguaje sencillo y explicaciones detalladas. Quiero un desarrollo iterativo con comunicación clara en cada paso. Por favor, pregunta antes de hacer cambios importantes. Valoro el código limpio, modular y bien comentado. Asegúrate de que todas las animaciones estén optimizadas a **60 FPS** y que el diseño sea completamente **responsivo** en todos los dispositivos.

### Arquitectura del Sistema
La aplicación está construida con una pila puramente front-end: **HTML5** para la estructura semántica, **CSS3** para el estilo y las animaciones (Flexbox, Grid, animaciones con keyframes, variables CSS, temas) y **JavaScript ES6+** para la lógica modular, **LocalStorage API** y **Web Audio API**. No se utilizan frameworks ni librerías externas.

---

### Decisiones de UI/UX
- **Paleta de Colores:** Tonos pasivos (pasteles suaves) para el modo claro y acentos vibrantes oscuros para el modo oscuro.  
- **Diseño:** Minimalista y moderno, con animaciones fluidas, sombras sutiles y efectos de glassmorphism.  
- **Tipografía:** Fuente moderna **Poppins** de Google Fonts.  
- **Responsividad:** Diseño completamente adaptable a móvil, tableta y escritorio, con puntos de ruptura en 480 px y 768 px.  
- **Elementos Interactivos:** Barras de progreso animadas, partículas flotantes, celebraciones con confeti, efectos hover elegantes y transiciones suaves.  
- **Sistema de Insignias:** 8 insignias distintas para motivar a los usuarios según la creación y finalización de metas.

---

### Implementaciones Técnicas
- **Gestión de Metas:** Operaciones CRUD para metas que incluyen título, descripción, emoción, progreso, visualización, categoría, fecha límite y notas.  
- **Persistencia de Datos:** Uso de **LocalStorage API** para guardar metas, notas y preferencias de tema.  
- **Filtrado y Búsqueda:** Filtrado dinámico por categoría y progreso, ordenamiento multicriterio y búsqueda en tiempo real.  
- **Estadísticas:** Actualizaciones en tiempo real del total de metas, metas completadas, en progreso y porcentaje promedio de avance.  
- **Sistema de Notas:** Notas por meta con marcas de tiempo automáticas, gestionadas mediante un modal elegante.  
- **Temas:** Alternancia entre modo claro y oscuro con persistencia.  
- **Gestión de Datos:** Funcionalidad para exportar e importar datos en formato JSON con validación.  
- **Motivación:** Frases motivacionales aleatorias y un reproductor de música relajante usando **Web Audio API** para generar tonos armónicos.  
- **Seguridad:** Escapado de HTML para prevenir XSS, validación completa de formularios, validación de datos importados y manejo de errores.

---

### Especificaciones de Funciones
- **Sistema de Urgencia:** Cuenta regresiva dinámica para fechas límite con alertas codificadas por color (rojo para menos de 3 días, naranja para menos de 7 días).  
- **Celebración:** Animación de confeti activada al completar una meta al 100%.  
- **Efectos Visuales:** Partículas flotantes con movimiento sinusoidal, efectos hover 3D con transformaciones, gradientes animados y efectos de brillo en las barras de progreso.  
- **Audio:** **Web Audio API** usada para generar tonos armónicos de **432Hz** y **528Hz**.

---

### Dependencias Externas
- **Google Fonts:** Fuente **Poppins** para la tipografía.  
- **Web Audio API:** Para generar tonos armónicos relajantes como música de fondo.  
- **LocalStorage API:** Para la persistencia de datos del lado del cliente.
