const internal = require("stream");
const config = require("../config/index");
const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: config.minio.host,
  port: parseInt(config.minio.port),
  useSSL: false,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

/**
 * @param {String} BUCKET_NAME
 * @returns {Promise<{ status: boolean }>}
 */
const CheckBucketExist = async (BUCKET_NAME) => {
  const exist = await minioClient.bucketExists(BUCKET_NAME);
  if (exist) {
    console.log(`Bucket '${BUCKET_NAME}' exists.`);
    return { status: true };
  } else {
    const create = await minioClient.makeBucket(BUCKET_NAME, "ap-southeast-1");
    if (!create) {
      console.log("create bucket fail");
      return { status: false };
    }
    console.log(`Bucket '${BUCKET_NAME}' created successfully.`);
    return { status: true };
  }
};

/**
 * @param {String} BUCKET_NAME
 * @param {String} objectName
 * @param {Buffer | import('stream').Readable} buffer
 * @returns {Promise<{ status: boolean, data: any}>}
 */
const PutObject = async (BUCKET_NAME, objectName, buffer) => {
  try {
    const upload = await minioClient.putObject(BUCKET_NAME, objectName, buffer);
    return { status: true, data: upload };
  } catch (error) {
    return { status: false, data: null };
  }
};

/**
 * @param {String} BUCKET_NAME
 * @param {String} objectName
 * @returns {Promise<{ status: boolean, data: internal.Readable | null }>}
 */
const GetObject = async (BUCKET_NAME, objectName) => {
  try {
    const data = await minioClient.getObject(BUCKET_NAME, objectName);
    if (!data) {
        return { status: false, data: null }
    }
    return { status: true, data: data };
  } catch (error) {
    return { status: false, data: null };
  }
};

module.exports = {
  client: minioClient,
  CheckBucketExist: CheckBucketExist,
  GetObject: GetObject,
  PutObject: PutObject,
};
