# WhatsApp Sales Chatbot

Un chatbot de ventas para WhatsApp que utiliza IA (DeepSeek) para responder mensajes de forma inteligente, integrado con un panel de administración web para visualizar los chats en tiempo real.

## 🚀 Características

- **Automatización de WhatsApp:** Basado en `@open-wa/wa-automate`.
- **Inteligencia Artificial:** Respuestas inteligentes generadas por DeepSeek.
- **Panel Web:** Interfaz moderna construida con React y Material UI.
- **Tiempo Real:** Actualizaciones instantáneas de mensajes y estado mediante Socket.io.
- **Gestión de Chats:** Visualización de conversaciones y mensajes históricos.

## 📁 Estructura del Proyecto

- `backend/`: API de Express y cliente de WhatsApp (TypeScript).
- `frontend/`: Aplicación React + Vite (TypeScript).

## 🛠️ Instalación Local

### Backend

1. `cd backend`
2. `npm install`
3. `cp .env.example .env` (y configura tu `DEEPSEEK_API_KEY`)
4. `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 🌐 Despliegue en VPS

Si deseas desplegar este proyecto en un servidor Ubuntu, consulta nuestra guía detallada:

👉 **[Guía de Despliegue en VPS (Ubuntu)](./DEPLOY.md)**
