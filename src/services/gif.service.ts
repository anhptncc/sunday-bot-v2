import { Injectable } from '@nestjs/common';
import { createCanvas } from 'canvas';
import * as GIFEncoder from 'gif-encoder-2';

@Injectable()
export class GifService {
  async generateStarGif(stars: number): Promise<Buffer> {
    const width = 420;
    const height = 180;

    const encoder = new GIFEncoder(width, height);
    encoder.start();
    encoder.setRepeat(-1);
    encoder.setDelay(100);
    encoder.setQuality(10);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const frames = 25;

    for (let i = 0; i <= frames; i++) {
      const current = Math.floor((stars / frames) * i);

      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#161b22';
      ctx.fillRect(0, 0, width, 36);

      ctx.fillStyle = '#58a6ff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('mezon.sh', 16, 24);

      ctx.fillStyle = '#7ee787';
      ctx.font = '16px monospace';
      ctx.fillText('$ stars --count', 16, 70);

      ctx.font = 'bold 42px monospace';

      ctx.fillStyle = '#e3b341';
      ctx.fillText('⭐', 16, 130);

      ctx.fillStyle = '#f0f6fc';
      ctx.fillText(`${current}`, 85, 130);

      if (i % 2 === 0) {
        ctx.fillRect(250, 95, 10, 3);
      }

      encoder.addFrame(ctx);
    }

    encoder.finish();
    return encoder.out.getData();
  }
}
