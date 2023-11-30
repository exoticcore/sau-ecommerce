import AWS from 'aws-sdk';

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';

const s3 = new AWS.S3({
  accessKeyId: <string>process.env.S3_ACCESS_KEY,
  secretAccessKey: <string>process.env.S3_SECRET_KEY,
  region: <string>process.env.S3_REGION,
  endpoint: <string>process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
});

export default s3;
