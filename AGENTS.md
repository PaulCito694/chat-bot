# Agent Guidelines for Chatbot Project

Welcome, fellow agent! This file contains critical technical context, quirks, and instructions to help you navigate and modify this codebase effectively.

## 🏗️ Architecture Overview

- **Backend**: Node.js (Express) using TypeScript in ESM mode.
- **Frontend**: React (Vite) using TypeScript and Material UI (MUI).
- **Communication**: REST API for historical data and Socket.io for real-time events.

## ⚠️ Technical Quirks & Rules

### 1. Backend ESM Module Resolution
This is a **TypeScript ESM** project.
- **Rule**: All internal module imports **MUST** include the `.js` extension (e.g., `import { x } from './ai.js';`), even if the source file is `.ts`.
- Failure to do this will cause Node.js execution errors.

### 2. Frontend Layout (MUI 9 + Vite 8)
Due to version-specific bugs/prop-mismatches in this environment:
- **Rule**: Use MUI `Box` with Flexbox for layouts instead of the `Grid` component to avoid "grid-item" prop errors.

### 3. Environment Variables
- **Backend**: `DEEPSEEK_API_KEY` is required. Uses `https://api.deepseek.com` as the base URL via the OpenAI SDK.
- **Frontend**: `VITE_API_URL` defaults to `http://localhost:8002`.

### 4. Real-time Events
The system relies on Socket.io for:
- `qr`: Sending the WhatsApp QR code (base64 string).
- `status`: Updating the connection status (`initializing`, `qr`, `authenticated`, etc.).
- `new_message`: Pushing new WhatsApp messages to the UI.

### 5. WhatsApp Client
- Uses `@open-wa/wa-automate`.
- Deployment on headless servers (Linux) requires specific libraries (see `DEPLOY.md`).
- Session data is stored in directories starting with `_IGNORE_`.

## 🛠️ Common Tasks

### Building & Running
- **Backend**:
  - Dev: `npm run dev` (uses `ts-node-esm` and `nodemon`).
  - Build: `npm run build` (outputs to `dist/`).
  - Run compiled: `npm start`.
- **Frontend**:
  - Dev: `npm run dev -- --port 3000`.
  - Build: `npm run build`.

### Backend Compilation
If you see deprecation warnings during `tsc`, notice that `tsconfig.json` has `"ignoreDeprecations": "5.0"` set to maintain compatibility with the current setup.

## 📊 API Summary

- `GET /health`: Health check.
- `GET /chats`: List all active chats.
- `GET /chats/:id/messages`: Get message history for a specific chat.

## 💾 Persistence
- **Note**: Currently, the system uses **in-memory storage** for chats and messages. No external database is connected. Data is lost on server restart.
