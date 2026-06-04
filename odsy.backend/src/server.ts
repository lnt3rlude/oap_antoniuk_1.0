import app from "./app";
import { initDb } from "./db/initDb"; 
import { all } from "./db/dbClient"; 

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  // ЗАПУСКАЄМО ОНОВЛЕНУ БАЗУ З ПАРОЛЯМИ ТА РОЛЯМИ
  await initDb(); 

  // === ТИМЧАСОВА ПЕРЕВІРКА СТОВПЦІВ ===
  try {
    const columns = await all(`PRAGMA table_info(Users);`); // Змінив на Users, щоб ти бачив свої колонки
    console.log("--------------------------------------------------");
    console.log("РЕАЛЬНІ СЛОВПЦІ В ТАБЛИЦІ USERS З БАЗИ ДАНИХ:");
    console.dir(columns);
    console.log("--------------------------------------------------");
  } catch (e) {
    console.log("Не вдалося прочитати структуру таблиці Users:", e);
  }

  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
