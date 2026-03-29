const { AppError } = require("../utils/appError");

class RdsContactRepository {
  constructor({ connectionString }) {
    this.connectionString = connectionString;
  }

  async save() {
    throw new AppError(501, "RDS保存は未実装です。server/repositories/rdsContactRepository.js を実装してください。");
  }
}

module.exports = { RdsContactRepository };
