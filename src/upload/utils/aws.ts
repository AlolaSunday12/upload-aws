import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export async function uploadImages(files: Array<Express.Multer.File>) {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('AWS_BUCKET_NAME is not defined in environment variables.');
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const filename = `uploads/${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
       // ACL: 'public-read',
      });

      await s3.send(command);

      return {
        Bucket: bucketName,
        Key: filename,
        Location: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`,
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload images: ${error.message}`);
    }
    throw new Error('An unknown error occurred while uploading images.');
  }
}
