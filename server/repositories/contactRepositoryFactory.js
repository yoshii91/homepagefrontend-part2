const { JsonContactRepository } = require("./jsonContactRepository");
const { SqliteContactRepository } = require("./sqliteContactRepository");
const { DynamoDbContactRepository } = require("./dynamodbContactRepository");
const { RdsContactRepository } = require("./rdsContactRepository");
const { AppError } = require("../utils/appError");

function createContactRepository({ config }) {
  if (config.dataProvider === "local-json") {
    return new JsonContactRepository({ dataDir: config.dataDir });
  }

  if (config.dataProvider === "sqlite") {
    return new SqliteContactRepository({ sqliteFilePath: config.sqliteFilePath });
  }

  if (config.dataProvider === "dynamodb") {
    return new DynamoDbContactRepository({
      tableName: config.dynamodbTable,
      region: config.awsRegion
    });
  }

  if (config.dataProvider === "rds") {
    return new RdsContactRepository({
      connectionString: config.rdsConnectionString
    });
  }

  throw new AppError(500, `Unsupported DATA_PROVIDER: ${config.dataProvider}`);
}

module.exports = { createContactRepository };
