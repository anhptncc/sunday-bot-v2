import * as dayjs from 'dayjs';
import { ChannelMessage, EMessageComponentType } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { CountdownService } from '@app/service/countdown.service';
import { CountdownType } from '@app/entities/countdown.entity';
import { MezonClientService } from '@app/services/mezon-client.service';
import { getRandomColor } from '@app/utils/helpers';

const slotItems = [
  '1.png',
  '2.png',
  '3.png',
  '4.png',
  '5.png',
  '6.png',
  '7.png',
  '8.png',
  '9.png',
  '10.png',
  '11.png',
  '12.png',
];

const hourglassIndex = slotItems.length - 2;
const dollarIndex = slotItems.length - 1;

@Command('demngaynhanluong', {
  usage: '*demngaynhanluong',
})
export class SalaryCountDownCommand extends CommandMessage {
  constructor(
    private readonly countdownService: CountdownService,
    clientService: MezonClientService,
  ) {
    super(clientService);
  }

  getPayDate() {
    const today = dayjs();
    let next = today.date(5);
    if (today.date() > 5) {
      next = today.add(1, 'month').date(5);
    }

    return next;
  }

  async execute(args: string[], message: ChannelMessage) {
    const messageChannel = await this.getChannelMessage(message);

    let title = '⏳ Cùng đếm ngược bao lâu nữa đến ngày nhận lương nào';

    const item = await this.countdownService.getCountdownByType(
      CountdownType.PAYDAY,
    );

    const defaultPayDate = item?.targetDate || this.getPayDate();
    const todayIsPayDate = dayjs().isSame(dayjs(defaultPayDate), 'day');

    const today = dayjs().startOf('day');
    const payday = dayjs(defaultPayDate).startOf('day');
    const daysLeft = Math.max(payday.diff(today, 'day'), 0);

    // handle push days left
    let number: number[] = [hourglassIndex, 0, 0];

    if (todayIsPayDate) {
      if (item?.isFinished) {
        title = '⏳ Lương đã về! Đếm làm gì cho mệt anh ơi!';
        number = [dollarIndex, dollarIndex, dollarIndex];
      } else {
        title = '⏳ Lương sắp về rồi... Anh ơi cố lên!';
        number = [hourglassIndex, hourglassIndex, hourglassIndex];
      }
    } else {
      if (daysLeft > 9) {
        const digits = daysLeft.toString().split('').map(Number);
        number[1] = digits[0];
        number[2] = digits[1];
      } else {
        number[1] = 0;
        number[2] = daysLeft;
      }
    }

    const results: string[][] = [];
    for (let i = 0; i < 3; i++) {
      const result = [...slotItems, slotItems[number[i]]];
      results.push(result);
    }

    const resultEmbed = {
      color: getRandomColor(),
      title,
      fields: [
        {
          name: '',
          value: '',
          inputs: {
            id: 'slots',
            type: EMessageComponentType.ANIMATION,
            component: {
              url_image:
                'https://cdn.mezon.ai/1840653661416460288/1958044376819044352/1803263641638670300/1755682031237_Frame_5.png',
              url_position:
                'https://cdn.mezon.ai/1840653661416460288/1958044376819044352/1803263641638670300/1755681221532_countdown.json',
              pool: results,
              repeat: 3,
              duration: 0.35,
            },
          },
        },
      ],
    };
    return messageChannel.reply({ embed: [resultEmbed] });
  }
}
