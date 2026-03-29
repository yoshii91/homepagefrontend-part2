const { AppError } = require("../utils/appError");

class DynamoDbContactRepository {
  constructor({ tableName, region }) {
    this.tableName = tableName;
    this.region = region;
  }

  async save() {
    throw new AppError(501, "DynamoDB保存は未実装です。server/repositories/dynamodbContactRepository.js を実装してください。");
  }
}

module.exports = { DynamoDbContactRepository };
