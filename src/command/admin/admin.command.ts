import { CommandMessage } from '@app/command/common/command.abstract';
import { Command } from '@app/decorators/command.decorator';
import { CountdownService } from '@app/service/countdown.service';
import { UserService } from '@app/service/user.service';
import { MezonClientService } from '@app/services/mezon-client.service';
import * as dayjs from 'dayjs';
import { ChannelMessage, EMarkdownType } from 'mezon-sdk';

@Command('admin', {
  usage: '*admin',
  description: 'Admin command for managing the bot',
})
export class AdminCommand extends CommandMessage {
  constructor(
    clientService: MezonClientService,
    private readonly countdownService: CountdownService,
    private readonly userService: UserService,
  ) {
    super(clientService);
  }

  // example: *admin update payday 2024-07-05 true
  async execute(args: string[], message: ChannelMessage) {
    const messageChannel = await this.getChannelMessage(message);
    try {
      await this.userService.validateAdmin(message.sender_id);

      if (args[0] === 'update' && args[1] === 'payday') {
        const targetDate = args[2]; // can be null || 'YYYY-MM-DD'
        const isFinished = args[3] === 'true';
        if (
          targetDate === 'null' ||
          (targetDate && dayjs(targetDate, 'YYYY-MM-DD', true).isValid())
        ) {
          const countdown = await this.countdownService.updatePaydayCountdown({
            targetDate:
              targetDate === 'null'
                ? null
                : (dayjs(targetDate).format('YYYY-MM-DD') as unknown as Date),
            isFinished,
          });
          const contentMsg =
            'Payday countdown updated:\n' +
            'targetDate' +
            ': ' +
            countdown.targetDate +
            '\n' +
            'isFinished: ' +
            countdown.isFinished;
          return messageChannel.reply({
            t: contentMsg,
            mk: [
              {
                type: EMarkdownType.PRE,
                s: 0,
                e: contentMsg.length,
              },
            ],
          });
        }
      }

      if (args[0] === 'withdraw' && args[1]) {
        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
          return messageChannel.reply({ t: 'Invalid amount' });
        }
        await this.handleWithdraw(amount);
        return messageChannel.reply({
          t: `Withdraw ${amount} tokens successfully`,
        });
      }

      if (args[0] === 'balance') {
        const botBalance = await this.userService.getBotBalance();
        return messageChannel.reply({ t: `Bot balance: ${botBalance} tokens` });
      }
    } catch (error) {
      return messageChannel.reply({ t: 'Error: ' + error.message });
    }
  }

  async handleWithdraw(amount: number) {
    if (!process.env.BOT_ID) {
      throw new Error('BOT_ID is not defined');
    }
    const dataSendToken = {
      sender_id: process.env.BOT_ID,
      sender_name: 'Sunday',
      receiver_id: '1803263641638670336',
      amount,
    };
    await this.client.sendToken(dataSendToken);
  }
}
