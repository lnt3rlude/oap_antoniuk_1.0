import { db } from "./db";

// SELECT all
export function all<T>(
  sql: string
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(
      sql,
      (err: Error | null, rows: unknown[]) => {
        if (err) {
          return reject(err);
        }

        resolve(rows as T[]);
      }
    );
  });
}

// SELECT one
export function get<T>(
  sql: string
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      sql,
      (err: Error | null, row: unknown) => {
        if (err) {
          return reject(err);
        }

        resolve(row as T | undefined);
      }
    );
  });
}

// INSERT / UPDATE / DELETE
export function run(
  sql: string
): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(
      sql,
      function (this: any, err: Error | null) {
        if (err) {
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

// all -> список
// get -> один рядок
// run -> INSERT / UPDATE / DELETE