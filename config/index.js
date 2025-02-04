require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "http://127.0.0.1:3000",
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST
  },
  minio: {
    host: process.env.MINIO_HOST,
    port: process.env.MINIO_PORT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucketName: process.env.MINIO_BUCKET_NAME,
  },
};
