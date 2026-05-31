# WhatsApp Sales Chatbot & Dashboard

Este proyecto es una solución integral para la automatización de ventas a través de WhatsApp, integrando inteligencia artificial (DeepSeek) para respuestas automáticas y un panel de control web en tiempo real.

## 🚀 Características

- **Automatización de WhatsApp**: Basado en `@open-wa/wa-automate`.
- **IA Generativa**: Integración con DeepSeek API para respuestas inteligentes y contextuales.
- **Dashboard en Tiempo Real**: Panel construido con React y MUI para monitorear chats y escanear el código QR.
- **Comunicación Instantánea**: Uso de Socket.io para actualizaciones de estado y mensajes en tiempo real.
- **Arquitectura Moderna**: Backend en TypeScript (ESM) y Frontend con Vite.

## 🛠️ Estructura del Proyecto

- `backend/`: Servidor Node.js con Express, Socket.io y la lógica del bot de WhatsApp.
- `frontend/`: Aplicación React para la gestión y visualización de conversaciones.

## 📋 Requisitos Previos

- Node.js v18 o superior.
- Una clave de API de DeepSeek.
- Dependencias de sistema para Chromium (ver [DEPLOY.md](./DEPLOY.md)).

## 🔧 Configuración y Ejecución

### Backend

1. Entra en la carpeta: `cd backend`
2. Instala dependencias: `npm install`
3. Configura el entorno: `cp .env.example .env` y añade tu `DEEPSEEK_API_KEY`.
4. Ejecuta en desarrollo: `npm run dev`
5. Para producción: `npm run build && npm start`

El backend corre por defecto en el puerto `8002`.

### Frontend

1. Entra en la carpeta: `cd frontend`
2. Instala dependencias: `npm install`
3. Configura el entorno: `cp .env.example .env` (ajusta `VITE_API_URL` si es necesario).
4. Ejecuta en desarrollo: `npm run dev -- --port 3000`
5. Para producción: `npm run build`

## 📦 Despliegue

Para instrucciones detalladas sobre cómo desplegar en un servidor Ubuntu (VPS) con Nginx y PM2, consulta la [Guía de Despliegue](./DEPLOY.md).

## 📄 Licencia

Este proyecto es de código abierto.
