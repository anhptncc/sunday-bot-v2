import { ChannelMessage, EMarkdownType } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';

@Command('sdhelp', {
  description: 'Shows available commands and their usage',
})
export class HelpCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  async execute(args: string[], message: ChannelMessage) {
    const messageChannel = await this.getChannelMessage(message);

    const messageContent =
      `#Available Commands:\n` +
      `*demngaynhanluong\n` +
      `*demngaytetam\n` +
      `*demngaytetduong\n` +
      `*demngaygiangsinh\n` +
      `*demngayditu\n` +
      `*demngayditu start [pháp danh]\n` +
      `*demngayditu rename [pháp danh]\n` +
      `*decision`;

    return messageChannel.reply({
      t: messageContent,
      mk: [{ type: EMarkdownType.PRE, s: 0, e: messageContent.length }],
    });
  }
}
