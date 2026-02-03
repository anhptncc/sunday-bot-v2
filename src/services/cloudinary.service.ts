import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'ddzhxq9aw',
  api_key: '913655295142687',
  api_secret: process.env.CLOUDINARY_SECRET,
});

@Injectable()
export class CloudinaryService {
  private readonly folder = 'github-stars';

  async uploadGif(
    buffer: Buffer,
    publicId: string,
    folder: string = this.folder,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
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

  async getExistingGifUrl(
    publicId: string,
    folder: string = this.folder,
  ): Promise<string | null> {
    try {
      const result = await cloudinary.api.resource(`${folder}/${publicId}`, {
        resource_type: 'image',
      });

      return result.secure_url;
    } catch (error) {
      console.log('🚀 ~ CloudinaryService ~ getExistingGifUrl ~ error:', error);
      return null;
    }
  }
}
