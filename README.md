# Folk Finance Backend

This repository contains the **Folk Finance** backend service built with **Node.js** and **TypeScript**. It provides RESTful APIs, connects to a MongoDB database, and handles business logic for Folk Finance TG Mini App.

---

## Prerequisites

- **Node.js** (v20 or higher recommended)
- **npm** (v10 or higher)
- **MongoDB** instance ( remote)

---

## Getting Started

1. **Clone the repository**  

   ```bash
        git clone https://github.com/Folks-Finance/tg-mini-app-backend-internal.git
        cd tg-mini-app-backend-internal
   ```

2. **Use the main branch**  

    Make sure you're on the main branch

3. **Enter the npm i command**  

    ```bash
        npm i
    ```

4. **Setup the .env file in root folder**  

    ```bash
        NODE_ENV=development/production<environment setup>
        PORT=8000<port>
        MONGODB_URI=mongodb://localhost:27017/<mongo url>
        MONGODB_DB_MAIN=folk<database name>
        WEB_APP_URL=https://url.com<the backend service tg mini server url>
        BOT_TOKEN=<Telegram mini app bot token to be placed after you have created the bot>
    ```

5. **Build the code before starting**  

    Make sure you create a build of the latest code.

    ```bash
        npm run build
    ```

6. **Start/stop the backend service commands**  
    To start or stop the backend services checkout the package.json scripts section 

    ```bash
        Start -> npm run start-server
        Stop  -> npm run stop-server
    ```

7. **Check server health**  
    To check server health use server url + /health as a GET request 

    ```bash
        curl http://localhost:8000/health
    ```
    If you see a 200 ok response, server is running successfully