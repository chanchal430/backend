# Folk Finance Backend

Backend service for the **Folk Finance Telegram Mini App**, handling user management, game mechanics, tasks, referrals, and quizzes.

---

## 📁 Project Structure

- `src/` – TypeScript source files
- `build/` – Compiled JavaScript output
- `routes/` – API endpoints
- `config/` – Server, database, and environment config
- `components/` – Business logic (controllers, services, validation)
- `utils/` – Utility helpers

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/folk-finance-backend.git
cd folk-finance-backend

```

---

### 2. Install Dependencies
```bash
npm Install

```

### 3. Configure Environment Variables

Create a .env file in src/config/env/ or project root.

```bash
PORT=9000
MONGO_URI=mongodb://localhost:27017/folk-finance
JWT_SECRET=yourSecretKey
```
---
## Start with PM2 (Recommended)

```bash
npm run start-server
```