const { AppError } = require("../utils/appError");

class S3ImageStorage {
  constructor({ bucketName, region }) {
    this.bucketName = bucketName;
    this.region = region;
  }

  async save(file) {
    if (!file) {
      return null;
    }

    throw new AppError(501, "S3画像保存は未実装です。server/storage/s3ImageStorage.js を実装してください。");
  }
}

module.exports = { S3ImageStorage };
