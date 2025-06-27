
```markdown
Telegram Mini App Backend

A scalable backend for a Telegram Mini App, built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**.  
Handles user authentication, referrals, social tasks, check-ins, and in-app tap-game logic.



1.Clone the Repository


git clone https://github.com/Folks-Finance/tg-mini-app-backend-internal
git checkout feat/new


2. Install Dependencies


npm install

3. Configure the Database

* Install and run PostgreSQL on your machine.

* Create a new database:

  createdb telegram_mini


* Run the table creation scripts found in `table-query/` or paste your provided `CREATE TABLE` SQL statements in the psql shell:

 
  psql -d telegram_mini
  Then run your table creation SQL
  

---

### 4. **Set Up Environment Variables**

Create a `.env` file at the project root:


DATABASE_URL="postgresql://postgres:<password>@localhost:5432/telegram_mini"
PORT=8000
PRIVY_APP_ID=""
PRIVY_APP_SECRET=""


> Replace `<password>` with your local postgres password.
> Fill in Privy credentials use https://privy.io/

---

### 5. **Start the Development Server**

```bash
npm run dev
```

* This will start the server with `nodemon` for automatic reloads on file changes.

**To run in production:**

```bash
npm run build
npm start
```

---

## 🧪 API Usage

API endpoints are grouped by feature module.
Some examples:

* `GET /api/user/me` — Fetch the authenticated user’s profile.
* `POST /api/user` — Register or update a user.
* `GET /api/tasks` — List available social tasks.
* `POST /api/checkin` — Mark daily/weekly check-in.
* More endpoints are available; see `src/modules/` for details.

You can use [Postman](https://www.postman.com/) or [curl](https://curl.se/) to test your endpoints.

---

## 🛠️ Troubleshooting

* **Database connection errors:**
  Ensure your `.env` is set up and PostgreSQL is running.
* **Missing tables:**
  Run all required `CREATE TABLE` statements in your database.
* **Environment issues:**
  Double-check `.env` and installed dependencies.

---

## 📖 Additional Notes

* **Code is modular**: Add features by creating new modules in `src/modules/`.
* **Supports Privy authentication**.
* **Refer to `src/config/db.ts`** for database connection logic.
* **Extend with new tables** using migrations or manual SQL as your app grows.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome!
Please open an issue or submit a pull request.

---

## 📝 License

MIT License

---

## 👤 Maintainer

* Your Name ([@shivam-V8](https://t.me/heyshiri) or [GitHub](https://github.com/shivam-V8))


