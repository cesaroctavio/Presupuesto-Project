# Mi Presupuesto — Control Quincenal

Una aplicación web moderna diseñada para la gestión financiera personal bi-mensual. Optimizada para ofrecer una experiencia visual premium con un diseño **Dark Glassmorphism** y un flujo de trabajo intuitivo.

## ✨ Características

- **Control Quincenal**: Visualización separada por periodos (Quincena 1 y Quincena 2) para alinear gastos con nóminas.
- **Categorización Inteligente**: Gestión de Ingresos, Ahorros, Bills (Fijos) y TDC / Suscripciones.
- **Dashboard Global**: Resumen mensual con balance neto y barras de progreso porcentuales para visualizar la distribución del gasto.
- **Persistencia Local**: Guardado automático en el navegador (LocalStorage) para que tus datos estén siempre disponibles.
- **Interfaz Premium**: Diseño basado en el sistema de diseño "Glassmorphism" con fuentes modernas (Outfit) y micro-animaciones fluidas.

## 🛠️ Stack Tecnológico

- **Frontend**: React 18
- **Build Tool**: Vite 6
- **Estilos**: Vanilla CSS (CSS-first architecture)
- **Iconografía**: Font Awesome 6
- **Tipografía**: Outfit (Google Fonts)

## 🚀 Inicio Rápido

Para ejecutar este proyecto localmente, asegúrate de tener [Node.js](https://nodejs.org/) instalado.

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Acceder a la app**:
   La aplicación estará disponible en `http://localhost:5173/`.

## 📂 Estructura del Proyecto

```text
src/
├── components/          # Componentes modulares (Header, TabBar, Modal, etc.)
├── data.js              # Semilla de datos, constantes y utilerías
├── App.jsx              # Lógica de estado global y orquestación
├── App.css              # Sistema de diseño y tokens visuales
└── main.jsx             # Punto de entrada de React
```

## 📝 Uso

- **Añadir**: Utiliza el botón flotante (+) para abrir el formulario de nuevo movimiento.
- **Cambiar Periodo**: Navega entre "Quincena 1", "Quincena 2" y "Mes" usando la barra de pestañas superior.
- **Eliminar**: Pasa el cursor (o presiona) una transacción para mostrar el icono de papelera y eliminar el registro.

---

*Proyecto migrado a React para mejorar la escalabilidad y el rendimiento.*