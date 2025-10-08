import { ChannelMessage, EMarkdownType } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';
import { UserService } from '@app/service/user.service';

@Command('kttk', {
  description: 'Shows available commands and their usage',
})
export class KttkCommand extends CommandMessage {
  constructor(
    clientService: MezonClientService,
    private readonly userService: UserService,
  ) {
    super(clientService);
  }

  async execute(args: string[], message: ChannelMessage) {
    const messageChannel = await this.getChannelMessage(message);

    const userBalance = await this.userService.getUserBalance(
      message.sender_id,
    );
    const messageContent = `Số dư của bạn: ${userBalance} token.`;

    return messageChannel.reply({
      t: messageContent,
      mk: [{ type: EMarkdownType.PRE, s: 0, e: messageContent.length }],
    });
  }
}
