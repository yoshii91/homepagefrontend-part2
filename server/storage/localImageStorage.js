const fs = require("fs/promises");
const path = require("path");
const { AppError } = require("../utils/appError");

const MIME_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

function toSafeFilename(input) {
  return input.replace(/[^a-zA-Z0-9._-]/g, "_");
}

class LocalImageStorage {
  constructor({ uploadDir }) {
    this.uploadDir = uploadDir;
  }

  async save(file) {
    if (!file) {
      return null;
    }

    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      throw new AppError(400, "photoは画像ファイルのみ対応しています");
    }

    const ext = MIME_EXTENSIONS[file.mimetype] || path.extname(file.originalname) || ".bin";
    const original = toSafeFilename(path.basename(file.originalname, path.extname(file.originalname)));
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fileName = `${Date.now()}-${original.slice(0, 30) || "photo"}${ext}`;
    const folder = path.join(this.uploadDir, datePart);
    const fullPath = path.join(folder, fileName);

    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(fullPath, file.buffer);

    return {
      provider: "local",
      path: path.posix.join("uploads", datePart, fileName),
      mimeType: file.mimetype,
      size: file.size
    };
  }
}

module.exports = { LocalImageStorage };
