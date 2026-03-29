const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

function parseNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

const projectRoot = path.resolve(__dirname, "../..");

const config = {
  port: parseNumber(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean),
  dataProvider: process.env.DATA_PROVIDER || "local-json",
  storageProvider: process.env.STORAGE_PROVIDER || "local",
  dataDir: path.resolve(projectRoot, process.env.DATA_DIR || "data"),
  sqliteFilePath: path.resolve(projectRoot, process.env.SQLITE_FILE || "data/contacts.sqlite"),
  uploadDir: path.resolve(projectRoot, process.env.UPLOAD_DIR || "storage/uploads"),
  docsDir: path.resolve(projectRoot, "docs"),
  awsRegion: process.env.AWS_REGION || "ap-northeast-1",
  dynamodbTable: process.env.DYNAMODB_TABLE || "contact-estimates",
  rdsConnectionString: process.env.RDS_CONNECTION_STRING || "",
  s3BucketName: process.env.S3_BUCKET_NAME || "",
  maxUploadSizeBytes: parseNumber(process.env.MAX_UPLOAD_SIZE_MB, 5) * 1024 * 1024,
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMaxRequests: 100
};

module.exports = config;
