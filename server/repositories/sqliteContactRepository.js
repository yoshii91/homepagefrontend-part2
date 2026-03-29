const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { AppError } = require("../utils/appError");

class SqliteContactRepository {
  constructor({ sqliteFilePath }) {
    fs.mkdirSync(path.dirname(sqliteFilePath), { recursive: true });
    this.db = new sqlite3.Database(sqliteFilePath);
    this.initPromise = this.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        address TEXT NOT NULL,
        service TEXT NOT NULL,
        detail TEXT,
        photo_json TEXT,
        created_at TEXT NOT NULL
      )
    `);
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function onRun(error) {
        if (error) {
          reject(error);
          return;
        }
        resolve(this);
      });
    });
  }

  async save(contactRecord) {
    await this.initPromise;

    try {
      await this.run(
        `
          INSERT INTO contacts (
            id, name, phone, email, address, service, detail, photo_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          contactRecord.id,
          contactRecord.name,
          contactRecord.phone,
          contactRecord.email,
          contactRecord.address,
          contactRecord.service,
          contactRecord.detail || "",
          contactRecord.photo ? JSON.stringify(contactRecord.photo) : null,
          contactRecord.createdAt
        ]
      );

      return contactRecord;
    } catch (error) {
      throw new AppError(500, "SQLiteへの保存に失敗しました");
    }
  }
}

module.exports = { SqliteContactRepository };
