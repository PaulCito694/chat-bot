# Guía de Despliegue en Ubuntu Server (VPS)

Esta guía detalla los pasos necesarios para desplegar el Chatbot de WhatsApp en un servidor Ubuntu limpio.

## 1. Requisitos Previos

Asegúrate de tener Node.js instalado (se recomienda v18 o superior).

```bash
# Instalar Node.js (usando NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2. Dependencias del Sistema (Puppeteer/Chrome)

El cliente de WhatsApp requiere un navegador para funcionar. En Ubuntu Server (sin interfaz gráfica), necesitamos instalar las librerías necesarias para que Chromium funcione en modo "headless".

```bash
sudo apt-get update
sudo apt-get install -y libgbm-dev wget gnupg ca-certificates procps libxss1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 gconf-service libatk-bridge2.0-0 libgbm1 libxshmfence1
```

## 3. Configuración del Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env con tu API Key de DeepSeek
   nano .env
   ```
4. Compila el proyecto:
   ```bash
   npm run build
   ```
5. Ejecuta con PM2 (para mantenerlo corriendo en segundo plano):
   ```bash
   sudo npm install -g pm2
   pm2 start dist/index.js --name "whatsapp-backend"
   ```

## 4. Configuración del Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura la URL de la API:
   ```bash
   cp .env.example .env
   # Edita .env y pon la IP de tu VPS o tu dominio
   # Ejemplo: VITE_API_URL=http://tu-vps-ip:8002
   nano .env
   ```
4. Compila el frontend:
   ```bash
   npm run build
   ```
   Esto generará una carpeta `dist/` con los archivos estáticos.

## 5. Configuración de Nginx (Servidor Web)

Para servir el frontend y hacer proxy al backend:

1. Instala Nginx:
   ```bash
   sudo apt-get install -y nginx
   ```
2. Crea una configuración para el sitio:
   ```bash
   sudo nano /etc/nginx/sites-available/chatbot
   ```
3. Pega el siguiente contenido, asegurándote de reemplazar los valores marcados:

- `tu-dominio-o-ip.com`: Pon tu IP (ej: `187.33.147.246`) o usa `_` si no tienes dominio.
- `/ruta/al/proyecto`: Ruta absoluta donde clonaste el repo (ej: `/home/ubuntu/whatsapp-chatbot`).

```nginx
server {
    listen 80;
    server_name _; # O tu dominio si lo tienes

    # Frontend (Archivos estáticos)
    location / {
        root /ruta/al/proyecto/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API & Socket.io
    location /socket.io/ {
        proxy_pass http://localhost:8002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # Proxy para todas las rutas que comiencen con /chats o /health
    location ~ ^/(chats|health) {
        proxy_pass http://localhost:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. Habilita el sitio, deshabilita el default y reinicia Nginx:
   ```bash
   # Eliminar la configuración por defecto de Nginx para evitar conflictos
   sudo rm /etc/nginx/sites-enabled/default

   # Habilitar la nueva configuración
   sudo ln -s /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/

   # Verificar y reiniciar
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 6. Consideraciones Finales

- **Puertos:** Asegúrate de que el puerto 80 (HTTP) y opcionalmente el 8002 (si no usas Nginx para todo) estén abiertos en el firewall de tu VPS.
- **Sesión de WhatsApp:** La primera vez que inicies el backend, deberás abrir el frontend en tu navegador para escanear el código QR que aparecerá.
