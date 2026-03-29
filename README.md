# Contact API (Express)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

- Open: `http://localhost:3000/contact.html`
- API health: `GET /health`
- Contact submit: `POST /contact`

## POST /contact

Content-Type: `multipart/form-data`

Required fields:
- `name`
- `phone`
- `email`
- `address`
- `service`

Optional fields:
- `detail`
- `photo` (image)

Success response:

```json
{
  "success": true,
  "id": "TEMP-20260329-ABC123"
}
```

Error response example:

```json
{
  "success": false,
  "error": "入力内容に不備があります",
  "details": [
    { "field": "name", "message": "必須項目です" }
  ]
}
```

## Local Storage

- Contact records: `data/contacts.json`
- Contact records (SQLite): `data/contacts.sqlite`
- Uploaded images: `storage/uploads/YYYYMMDD/...`

## Provider switch

- `DATA_PROVIDER=local-json` : JSONファイル保存
- `DATA_PROVIDER=sqlite` : SQLite保存
- `DATA_PROVIDER=dynamodb` : DynamoDB保存（雛形のみ。未実装）
- `DATA_PROVIDER=rds` : RDS保存（雛形のみ。未実装）

- `STORAGE_PROVIDER=local` : ローカル画像保存
- `STORAGE_PROVIDER=s3` : S3画像保存（雛形のみ。未実装）

## Security (minimum)

- `helmet`
- `cors`
- `express-rate-limit`
- upload size limit + image-only filter

## AWS-ready extension points

Switch by env vars:

- `DATA_PROVIDER=local-json`
- `DATA_PROVIDER=sqlite`
- `DATA_PROVIDER=dynamodb`
- `DATA_PROVIDER=rds`
- `STORAGE_PROVIDER=local`
- `STORAGE_PROVIDER=s3`

You can add new providers at:

- `server/repositories/contactRepositoryFactory.js`
- `server/storage/imageStorageFactory.js`

Current skeleton files:

- `server/repositories/dynamodbContactRepository.js`
- `server/repositories/rdsContactRepository.js`
- `server/storage/s3ImageStorage.js`

Recommended future implementations:

- AWS SDK v3で `s3ImageStorage.save(file)` を実装
- DynamoDB PutItemまたはDocumentClientで `save` を実装
- RDSは Prisma / knex / Sequelize などで `save` を実装
