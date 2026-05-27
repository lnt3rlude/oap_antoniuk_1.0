
import { all } from "../src/db/dbClient"

export async function getTop5MVP() {
  return all(`
    SELECT 
      u.id AS userId,
      u.userName,
      u.email,
      SUM(oi.quantity) AS totalItemsBought
    FROM Users u
    JOIN Orders o ON o.userId = u.id
    JOIN OrderItems oi ON oi.orderId = o.id
    GROUP BY u.id
    ORDER BY totalItemsBought DESC
    LIMIT 5
  `);
}


export async function getTotalOrdersOfTop5Clients() {
  return all(`
    SELECT
      SUM(o.id) AS totalOrdersOfMVP5
    FROM orders o
    JOIN OrderItems oi ON oi.orderId = o.id
    WHERE o.userId IN (
      SELECT u.id
      FROM users u
      JOIN orders ord
        ON ord.userId = u.id
      GROUP BY u.id
      ORDER BY COUNT(ord.id) DESC
      LIMIT 5
    )
  `);
}

export async function getTop5UsersWithItemsStats() {
  // return all(`
  //   SELECT
  //     u.userName,
  //     COUNT(DISTINCT o.id) AS totalOrders
  //     SUM(oi.quantity) AS totalItemsBought
  //   FROM users u
  //   JOIN Orders o ON o.userId = u.id
  //   JOIN OrderItems oi ON oi.orderId = o.id
  //   GROUP BY u.id, u.userName
  //   ORDER BY totalItemsBought DESC
  //   LIMIT 5
  // `);

  const usersIds = await all<{ userId: string, orderCount: number }>(`
    SELECT
      userId,
      COUNT(o.id) orderCount
    FROM Orders o
    GROUP BY userId
    ORDER BY orderCount DESC, userId ASC
    LIMIT 5
    `);

  const map2 = await all<{ userId: string, totalItemsBought: number }>(`
    SELECT
      o.userId,
      SUM(oi.quantity) AS totalItemsBought
    FROM OrderItems oi
    JOIN Orders o ON oi.orderId = o.id
    WHERE o.userId IN (${usersIds.map(x => x.userId).join(',')})
    GROUP BY o.userId
  `);

  const map = await all<{ id: string, userName: string }>(`
    SELECT id, userName FROM users
    WHERE id IN (${usersIds.map(x => x.userId).join(',')})
  `);

  const result: Record<string, any> = {};
  for (let i = 0; i < usersIds.length; i++) {
    const userId = usersIds[i].userId;
    const userName = map.find(x => x.id == userId)!.userName;
    const totalItemsBought = map2.find(x => x.userId == userId)!.totalItemsBought;
    result[userName] = {
      orderCount: usersIds[i].orderCount,
      totalItemsBought: totalItemsBought
    }
  }

  return result;
}

// Перероби, щоб функція виводила типу статистики по юзернейму та замовленням (Щоб виводило юзернейнейм і кількість замолвених ним товарів)

