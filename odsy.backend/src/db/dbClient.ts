import { db } from "./db";

// SELECT all
export function all<T>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(
      sql,
      params,
      (err: Error | null, rows: unknown[]) => {
        if (err) {
          console.error(" Database SQLITE3 [all] Error:", err.message, "SQL:", sql);
          return reject(err);
        }
        resolve(rows as T[]);
      }
    );
  });
}

// SELECT one
export function get<T>(
  sql: string,
  params: any[] = []
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      sql,
      params,
      (err: Error | null, row: unknown) => {
        if (err) {
          console.error(" Database SQLITE3 [get] Error:", err.message, "SQL:", sql);
          return reject(err);
        }
        resolve(row as T | undefined);
      }
    );
  });
}

// INSERT / UPDATE / DELETE
export function run(
  sql: string,
  params: any[] = []
): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(
      sql,
      params,
      function (this: any, err: Error | null) {
        if (err) {
          console.error(" Database SQLITE3 [run] Error:", err.message, "SQL:", sql);
          return reject(err);
        }
        resolve({
          lastID: this.lastID,
          changes: this.changes,
        });
      }
    );
  });
}
