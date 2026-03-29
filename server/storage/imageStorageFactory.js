const { LocalImageStorage } = require("./localImageStorage");
const { S3ImageStorage } = require("./s3ImageStorage");
const { AppError } = require("../utils/appError");

function createImageStorage({ config }) {
  if (config.storageProvider === "local") {
    return new LocalImageStorage({ uploadDir: config.uploadDir });
  }

  if (config.storageProvider === "s3") {
    return new S3ImageStorage({
      bucketName: config.s3BucketName,
      region: config.awsRegion
    });
  }

  throw new AppError(500, `Unsupported STORAGE_PROVIDER: ${config.storageProvider}`);
}

module.exports = { createImageStorage };
