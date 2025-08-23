import * as dayjs from 'dayjs';
import { ChannelMessage, EMessageComponentType } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';
import { getRandomColor } from '@app/utils/helpers';

const imageItems = [
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
];

const happyIconIndex = imageItems.length - 1;

@Command('demngaygiangsinh', {
  usage: '*demngaygiangsinh',
})
export class ChristmasCountDownCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  getNextChristmasCountdown() {
    const today = dayjs().format('YYYY-MM-DD');
    const currentYear = dayjs(today).year();

    let christmas = dayjs(`${currentYear}-12-25`);

    if (dayjs(today).isSame(christmas, 'day')) {
      return {
        year: currentYear,
        date: christmas.format('YYYY-MM-DD'),
        daysLeft: 0,
        isToday: true,
      };
    }

    if (dayjs(today).isAfter(christmas, 'day')) {
      christmas = dayjs(`${currentYear + 1}-12-25`);
    }

    const daysLeft = christmas.diff(today, 'day');

    return {
      year: christmas.year(),
      date: christmas.format('YYYY-MM-DD'),
      daysLeft,
      isToday: false,
    };
  }

  async execute(args: string[], message: ChannelMessage) {
    const messageChannel = await this.getChannelMessage(message);
    let title = '⌛️ Đếm ngược đến Giáng Sinh';

    const nextNY = this.getNextChristmasCountdown();

    const daysLeft = nextNY ? nextNY.daysLeft : 0;

    let number: number[] = [0, 0, 0];
    const digits = daysLeft.toString().split('').map(Number);

    if (nextNY.isToday) {
      title = '🎄 Chúc mừng Giáng Sinh an lành!';
      number = [happyIconIndex, happyIconIndex, happyIconIndex];
    } else {
      if (daysLeft > 100) {
        number = [digits[0], digits[1], digits[2]];
      } else if (daysLeft > 9 && daysLeft < 100) {
        number[0] = 0;
        number[1] = digits[0];
        number[2] = digits[1];
      } else {
        number[0] = 0;
        number[1] = 0;
        number[2] = daysLeft;
      }
    }

    const results: string[][] = [];
    for (let i = 0; i < 3; i++) {
      const result = [...imageItems, imageItems[number[i]]];
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
                'https://cdn.mezon.ai/1840653661416460288/1958044376819044352/1803263641638670300/1755922887666_christmas.png',
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
