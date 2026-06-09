import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET_NAME;
const CDN    = process.env.AWS_CLOUDFRONT_URL;

/**
 * Generate a presigned URL so the browser uploads DIRECTLY to S3.
 * Video/image bytes never pass through our server — reduces load massively.
 * URL expires in 5 minutes.
 */
export async function getPresignedUploadUrl(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn: 300 });
}

/**
 * Get the CloudFront CDN URL for a stored file.
 * Always serve files through CDN, never directly from S3.
 */
export function getCdnUrl(key) {
  return `${CDN}/${key}`;
}

/**
 * Generate a unique S3 object key for a user upload.
 * Format: type/userId/timestamp-filename
 */
export function generateS3Key(userId, type, filename) {
  const timestamp = Date.now();
  const clean = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${type}/${userId}/${timestamp}-${clean}`;
}
