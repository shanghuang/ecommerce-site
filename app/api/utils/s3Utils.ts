import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export async function s3Upload(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  const credentials = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
  };

  console.log('File:', file);

  console.log('process.env.ACCESS_KEY,', process.env.ACCESS_KEY);
  console.log('process.env.SECRET_ACCESS_KEY,', process.env.SECRET_ACCESS_KEY);
  console.log('process.env.AWS_REGION,', process.env.AWS_REGION);
  console.log('process.env.AWS_BUCKET_NAME,', process.env.AWS_BUCKET_NAME);

  
  try {
    if (!process.env.ACCESS_KEY || !process.env.SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
      throw new Error('Missing AWS configuration in environment variables');
    }

    const client = new S3Client({ 
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
      },
      region: process.env.AWS_REGION
    });

    const fileBuffer = await file.arrayBuffer()
    console.log('fileBuffer.byteLength', fileBuffer.byteLength);
    const res =await client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uuidv4(),
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      ACL: 'public-read'
    }))

    console.log("res", res);
    return Response.json({ success: true })
  } catch (error) {
    console.log('Error:', error);
    return Response.json({ error: error.message })
  }
}