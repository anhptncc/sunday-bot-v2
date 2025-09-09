import { ChannelMessage, EMarkdownType } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';

@Command('help', {
  description: 'Shows available commands and their usage',
})
export class HelpCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  async execute(args: string[], message: ChannelMessage) {

    const messageChannel = await this.getChannelMessage(message);

    const messageContent =
      `**Available Commands:**\n` +
      `*demngaynhanluong\n` +
      `*demngaytetam\n` +
      `*demngaytetduong\n` +
      `*demngaygiangsinh`;

    return messageChannel.reply({
      t: messageContent,
      mk: [{ type: EMarkdownType.PRE, s: 0, e: messageContent.length }],
    });
  }
}
