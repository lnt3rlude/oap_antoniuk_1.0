import app from "./app";
import { migrate } from "./db/migrate";
import { all } from "./db/dbClient"; // Додаємо імпорт нашого dbClient

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await migrate();

  // === ТИМЧАСОВА ПЕРЕВІРКА СТОВПЦІВ ===
  try {
    const columns = await all(`PRAGMA table_info(Orders);`);
    console.log("--------------------------------------------------");
    console.log("РЕАЛЬНІ СЛОВПЦІ В ТАБЛИЦІ ORDERS З БАЗИ ДАНИХ:");
    console.dir(columns);
    console.log("--------------------------------------------------");
  } catch (e) {
    console.log("Не вдалося прочитати структуру таблиці Orders:", e);
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