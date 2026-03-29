const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const multer = require("multer");

const config = require("./config");
const { AppError } = require("./utils/appError");
const { createContactRouter } = require("./routes/contact");
const { createContactRepository } = require("./repositories/contactRepositoryFactory");
const { createImageStorage } = require("./storage/imageStorageFactory");
const { ContactService } = require("./services/contactService");

function createCorsOptions() {
  const allowAll = config.corsOrigins.includes("*");

  return {
    origin(origin, callback) {
      if (allowAll || !origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new AppError(403, "許可されていないオリジンです"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  };
}

function createUploadMiddleware() {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: config.maxUploadSizeBytes,
      files: 1
    },
    fileFilter(req, file, callback) {
      if (file.mimetype && file.mimetype.startsWith("image/")) {
        callback(null, true);
        return;
      }
      callback(new AppError(400, "photoは画像ファイルのみ対応しています"));
    }
  });
}

function buildApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  app.use(cors(createCorsOptions()));
  app.use(rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    standardHeaders: true,
    legacyHeaders: false
  }));

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  const contactRepository = createContactRepository({ config });
  const imageStorage = createImageStorage({ config });
  const contactService = new ContactService({ contactRepository, imageStorage });
  const upload = createUploadMiddleware();

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use(createContactRouter({ upload, contactService }));

  app.use("/uploads", express.static(config.uploadDir));
  app.use(express.static(config.docsDir));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/") || req.path === "/contact") {
      return next(new AppError(404, "エンドポイントが見つかりません"));
    }

    return res.sendFile(path.join(config.docsDir, "index.html"));
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          error: "画像サイズが上限を超えています"
        });
      }
      return res.status(400).json({ success: false, error: err.message });
    }

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        error: err.message,
        details: err.details
      });
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      error: "サーバー内部エラー"
    });
  });

  return app;
}

module.exports = { buildApp };
