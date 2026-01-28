// cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'ddzhxq9aw',
  api_key: '913655295142687',
  api_secret: process.env.CLOUDINARY_SECRET,
});

@Injectable()
export class CloudinaryService {
  async uploadGif(buffer: Buffer, publicId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'github-stars',
            public_id: publicId,
            resource_type: 'image',
            format: 'gif',
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          },
        )
        .end(buffer);
    });
  }

  getImageUrl(publicId: string, folder: string = 'github-stars'): string {
    return cloudinary.url(`${folder}/${publicId}`, {
      resource_type: 'image',
      secure: true,
      format: 'gif',
    });
  }
}
