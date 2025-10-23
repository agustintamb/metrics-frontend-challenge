# 🖥️ Dashboard de Métricas - Challenge Frontend

## 📋 Descripción

Este proyecto es un **dashboard analítico en tiempo real** desarrollado como parte de un challenge técnico. La aplicación muestra métricas de negocio que se actualizan automáticamente, incluyendo KPIs, gráficos de evolución temporal y alertas visuales cuando ciertos indicadores superan umbrales críticos.

### ✨ Funcionalidades Implementadas

- **Visualización de métricas en tiempo real**: Usuarios activos, usuarios nuevos, ingresos y tasa de abandono
- **Gráfico interactivo**: Evolución temporal de métricas con opciones de filtrado
- **Sistema de alertas**: Destacado visual cuando la tasa de abandono supera el 5%
- **Filtros dinámicos**: Por rango temporal (último minuto, hora, día, histórico), tipo de métrica y región
- **Tabla paginada**: Historial completo de métricas con navegación
- **Diseño responsive**: Adaptado para desktop y mobile
- **Actualización automática**: Polling cada 5 segundos desde la API

#### 📈 Funcionalidades Adicionales Implementadas

- ✅ **Tabla paginada** con selector de cantidad de elementos
- ✅ **Estados de carga y error** en todos los componentes
- ✅ **Indicador visual en tiempo real** del estado de conexión
- ✅ **Tests unitarios** con buena cobertura
- ✅ **Accesibilidad** con navegación por teclado
- ✅ **Animaciones sutiles** para mejor UX
- ✅ **Manejo de errores robusto** con reintentos automáticos

### 🏗️ Arquitectura

#### Frontend
- **React 18** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **TailwindCSS** para estilos y componentes responsive
- **Zustand** para manejo de estado global
- **React Query (TanStack Query)** para fetching y cache de datos
- **Recharts** para visualización de gráficos
- **React Router** para navegación
- **Vitest** + **Testing Library** para testing

#### Backend (API Mock)
- **Node.js** con **Express**
- CORS habilitado para desarrollo local
- Generación de datos simulados con métricas aleatorias (AGREGADO)
- Sistema de memoria con límite para optimizar rendimiento (AGREGADO)

### 📁 Estructura del Proyecto

```
├── api/                         # Backend API Mock
│   ├── index.js                 # Servidor Express con endpoints
│   └── package.json             # Dependencias del backend
│
└── frontend/                    # Aplicación React
    ├── src/
    │   ├── components/common/   # Componentes reutilizables
    │   ├── features/            # Pages/funcionalidades específicas
    │   ├── stores/metrics/      # Stores de Zustand
    │   ├── services/            # Servicios para consumo de API
    │   ├── hooks/               # Custom hooks reutilizables
    │   ├── utils/               # Funciones auxiliares y formatters
    │   ├── constants/           # Configuraciones y constantes
    │   ├── interfaces/          # Tipos de TypeScript
    │   └── test/                # Utilities para testing
    ├── tailwind.config.js       # Configuración de TailwindCSS
    ├── vite.config.ts           # Configuración de Vite y testing
    └── package.json             # Dependencias del frontend
```

### 🎨 Características Técnicas Destacadas

- **Arquitectura de componentes modulares** con separación clara de responsabilidades
- **Estado reactivo** con Zustand para manejo eficiente de métricas y filtros
- **Optimización de renderizado** evitando re-renders innecesarios
- **Manejo robusto de errores** con estados de loading, error y datos vacíos
- **Sistema de filtrado en tiempo real** que preserva la performance
- **Componentes totalmente tipados** con TypeScript
- **Testing comprehensivo** con cobertura de componentes críticos
- **Diseño mobile-first** con componentes adaptativos
- **Accesibilidad** con navegación por teclado y lectores de pantalla

## 🚀 Despliegue en Producción

### 🌐 URLs de Acceso

- **Frontend**: [https://metrics-coral.vercel.app](https://metrics-coral.vercel.app)
- **Backend API**: [https://metrics-c2ka.onrender.com](https://metrics-c2ka.onrender.com)

### 📊 Endpoint de la API

- `GET /metrics?count=20` - Obtiene las últimas métricas generadas

## 💻 Desarrollo Local

### 📋 Prerrequisitos

- **Node.js** v18 o superior
- **npm** o **yarn**

### 🛠️ Instalación y Ejecución

#### 1. Clonar el repositorio
```bash
git clone https://github.com/agustintamb/metrics-frontend-challenge.git
cd metrics-frontend-challenge
```

#### 2. Levantar el Backend (API)
```bash
cd api
npm install
npm start
```
El servidor estará disponible en: `http://localhost:4000`

#### 3. Levantar el Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173`

### 🧪 Testing

Para ejecutar los tests del frontend:

```bash
cd frontend

# Ejecutar tests una vez
npm run test:run

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Abrir interfaz visual de tests
npm run test:ui
```

### 🔧 Scripts Disponibles

#### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run typecheck` - Verificación de tipos TypeScript

#### Backend
- `npm start` - Iniciar servidor
- `npm run dev` - Servidor con nodemon (desarrollo)

---

**Desarrollado por Agustin Tamburrino**