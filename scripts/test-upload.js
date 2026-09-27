const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function upload() {
  const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });

  const buffer = Buffer.from('test file content');
  
  console.log("Uploading to", process.env.R2_BUCKET_NAME);
  try {
    await S3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'test.txt',
      Body: buffer,
      ContentType: 'text/plain',
    }));
    console.log("Upload successful!");
    console.log("URL:", `${process.env.R2_PUBLIC_URL}/test.txt`);
  } catch (err) {
    console.error("Upload failed:");
    console.error(err);
  }
}

upload();
