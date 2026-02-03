import { ChannelMessage } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';
import { createMessageFromMsgReply } from '@app/utils/helpers';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GifService } from '@app/services/gif.service';
import { CloudinaryService } from '@app/services/cloudinary.service';

@Command('demmmnstar', {
  usage: '*demmmnstar',
})
export class DemMmnStarCommand extends CommandMessage {
  constructor(
    clientService: MezonClientService,
    private readonly http: HttpService,
    private readonly gif: GifService,
    private readonly cloudinary: CloudinaryService,
  ) {
    super(clientService);
  }

  async getStars(): Promise<number> {
    const res = await firstValueFrom(
      this.http.get(`https://api.github.com/repos/mezonai/mmn`),
    );
    return res.data.stargazers_count;
  }

  async execute(args: string[], message: ChannelMessage) {
    try {
      const messageChannel = await this.getChannelMessage(message);
      const stars = await this.getStars();

      const mmnFolder = 'github-mmn-stars';

      let url = await this.cloudinary.getExistingGifUrl(
        stars.toString(),
        mmnFolder,
      );
      if (!url) {
        const gifBuffer = await this.gif.generateStarGif(stars);
        url = await this.cloudinary.uploadGif(
          gifBuffer,
          stars.toString(),
          mmnFolder,
        );
      }
      const newUrl = `${url}?${Date.now()}`;
      const messBot = await messageChannel.reply(
        {},
        [],
        [
          {
            url: newUrl,
            filetype: 'image/gif',
            width: 420,
            height: 180,
          },
        ],
      );

      createMessageFromMsgReply(messBot, message);
    } catch (error) {
      console.log('🚀 ~ DemMezonStarCommand ~ execute ~ error:', error);
    }
  }
}
