const fs = require("fs/promises");
const path = require("path");
const { AppError } = require("../utils/appError");

class JsonContactRepository {
  constructor({ dataDir }) {
    this.filePath = path.join(dataDir, "contacts.json");
    this.writeQueue = Promise.resolve();
  }

  async ensureFile() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch (error) {
      await fs.writeFile(this.filePath, "[]\n", "utf-8");
    }
  }

  async save(contactRecord) {
    this.writeQueue = this.writeQueue.then(async () => {
      await this.ensureFile();
      let rows;
      try {
        const raw = await fs.readFile(this.filePath, "utf-8");
        rows = JSON.parse(raw);
        if (!Array.isArray(rows)) {
          throw new Error("contacts.json must be an array");
        }
      } catch (error) {
        throw new AppError(500, "保存データの読み込みに失敗しました");
      }

      rows.push(contactRecord);
      await fs.writeFile(this.filePath, `${JSON.stringify(rows, null, 2)}\n`, "utf-8");
      return contactRecord;
    });

    return this.writeQueue;
  }
}

module.exports = { JsonContactRepository };
