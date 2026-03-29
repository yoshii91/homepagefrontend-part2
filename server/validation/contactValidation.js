const { AppError } = require("../utils/appError");

const REQUIRED_FIELDS = ["name", "phone", "email", "address", "service"];

function sanitize(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactInput(body) {
  const payload = {
    name: sanitize(body.name),
    phone: sanitize(body.phone),
    email: sanitize(body.email),
    address: sanitize(body.address),
    service: sanitize(body.service),
    detail: sanitize(body.detail)
  };

  const errors = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (!payload[field]) {
      errors.push({ field, message: "必須項目です" });
    }
  });

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push({ field: "email", message: "メール形式が不正です" });
  }

  if (payload.phone && !/^[0-9+\-()\s]{8,20}$/.test(payload.phone)) {
    errors.push({ field: "phone", message: "電話番号形式が不正です" });
  }

  if (errors.length > 0) {
    throw new AppError(400, "入力内容に不備があります", errors);
  }

  return payload;
}

module.exports = { validateContactInput };
