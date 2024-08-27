import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { NextResponse } from 'next/server';

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// endpoint to get the list of files in the bucket
export async function GET() {
    const response = await s3.send(new ListObjectsCommand({ Bucket }));
    return NextResponse.json(response?.Contents ?? []);
  }
  
// endpoint to upload a file to the bucket
export async function POST(request) {
    const formData = await request.formData();
    const files = formData.getAll("file");
    let key; 
    await Promise.all(
        files.map(async (file) => {
          const Body = (await file.arrayBuffer());
          key = `videos/${path.basename(file.name)}`;
          const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `videos/${path.basename(file.name)}`,
            Body,
            ContentType: file.mimetype,
            };
        s3.send(new PutObjectCommand(uploadParams));
      })
    );
  
    return NextResponse.json(`https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);
  }