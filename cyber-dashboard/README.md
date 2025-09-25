# 🛡️ Dashboard de Ciberseguridad - Unitec

Dashboard interactivo y moderno para análisis de datos de ciberseguridad desarrollado como Proyecto Final para la Universidad Unitec.

## 🚀 Características

- **Visualización Interactiva**: Gráficos y tablas dinámicas para análisis de datos
- **Filtros Avanzados**: Filtrado por tipo de ataque, severidad, país y más
- **Diseño Moderno**: Interfaz limpia y responsiva con Tailwind CSS
- **Datos en Tiempo Real**: Conexión directa con dataset en S3
- **Seguridad**: Datos enmascarados para proteger la privacidad

## 📊 Funcionalidades

### Dashboard Principal
- Tarjetas de estadísticas con métricas clave
- Gráficos de barras para tipos de ataque
- Gráfico de pastel para distribución de severidad
- Tabla de datos con filtros y búsqueda

### Análisis de Datos
- **Total de Ataques**: Número total de incidentes registrados
- **Severidad Promedio**: Puntuación promedio de severidad
- **Usuarios Afectados**: Total de usuarios impactados
- **Tipos de Ataque**: Diversidad de vectores de ataque

### Filtros y Búsqueda
- Filtro por tipo de ataque
- Filtro por nivel de severidad
- Filtro por país de origen
- Búsqueda en tiempo real
- Límite de registros mostrados

## 🛠️ Tecnologías

- **Next.js 15**: Framework de React con App Router
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Framework de CSS utilitario
- **Recharts**: Biblioteca de gráficos para React
- **Lucide React**: Iconos modernos y consistentes
- **Radix UI**: Componentes accesibles y personalizables

## 📦 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd cyber-dashboard
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 🏗️ Estructura del Proyecto

```
cyber-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── badge.tsx
│   │   │   └── card.tsx
│   │   ├── Charts.tsx
│   │   ├── DataTable.tsx
│   │   ├── FilterPanel.tsx
│   │   └── StatsCards.tsx
│   ├── lib/
│   │   ├── data.ts
│   │   └── utils.ts
│   └── types/
│       └── cyber.ts
├── package.json
└── README.md
```

## 📊 Fuente de Datos

El dashboard se conecta directamente con el dataset de ciberseguridad almacenado en AWS S3:

**URL del Dataset**: `https://cyber-eda-aws-dataset-a8cc1963.s3.us-east-1.amazonaws.com/data/cyber_attacks_masked.csv`

### Estructura de Datos
- **ID**: Identificador único del ataque
- **Timestamp**: Fecha y hora del incidente
- **Attack Type**: Tipo de ataque (DDoS, Phishing, etc.)
- **Source IP**: Dirección IP de origen (enmascarada)
- **Target IP**: Dirección IP objetivo (enmascarada)
- **Country**: País de origen del ataque
- **Severity**: Nivel de severidad (Bajo, Medio, Alto, Crítico)
- **Severity Score**: Puntuación numérica de severidad (1-10)
- **Duration**: Duración del ataque en minutos
- **Affected Users**: Número de usuarios afectados
- **Username**: Nombre de usuario (enmascarado)
- **Email**: Dirección de email (enmascarada)
- **Description**: Descripción del incidente

## 🔒 Seguridad y Privacidad

- **Datos Enmascarados**: Todas las IPs, emails y nombres de usuario están enmascarados
- **Formato de IP**: XXX.XXX.XXX.XXX
- **Formato de Email**: ***@***.***
- **Formato de Usuario**: USER_****

## 🎨 Diseño

### Paleta de Colores
- **Primario**: Azul (#3B82F6)
- **Secundario**: Índigo (#6366F1)
- **Éxito**: Verde (#10B981)
- **Advertencia**: Amarillo (#F59E0B)
- **Peligro**: Rojo (#EF4444)
- **Info**: Cian (#06B6D4)

### Componentes
- **Cards**: Bordes redondeados con sombras suaves
- **Botones**: Estilo moderno con estados hover
- **Tablas**: Filas alternadas con hover effects
- **Gráficos**: Colores consistentes y accesibles

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio con Vercel
2. Configurar variables de entorno si es necesario
3. Desplegar automáticamente

### Netlify
1. Conectar repositorio con Netlify
2. Configurar build command: `npm run build`
3. Configurar publish directory: `.next`

### AWS Amplify
1. Conectar repositorio con AWS Amplify
2. Configurar build settings
3. Desplegar en AWS

## 📈 Mejoras Futuras

- [ ] Dashboard en tiempo real con WebSockets
- [ ] Exportación de datos en PDF/Excel
- [ ] Alertas automáticas por umbrales
- [ ] Integración con APIs de ciberseguridad
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Análisis predictivo con ML

## 👥 Contribuciones

Este proyecto fue desarrollado como Proyecto Final para la Universidad Unitec. Para contribuciones o mejoras, por favor contactar al equipo de desarrollo.

## 📄 Licencia

Proyecto desarrollado para fines académicos - Universidad Unitec.

---

**Desarrollado con ❤️ para la Universidad Unitec**