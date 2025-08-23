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

export const lunarNewYearDates: Record<number, string> = {
  2024: '2024-02-10',
  2025: '2025-01-29',
  2026: '2026-02-17',
  2027: '2027-02-06',
  2028: '2028-01-26',
  2029: '2029-02-13',
  2030: '2030-02-03',
  2031: '2031-01-23',
  2032: '2032-02-11',
  2033: '2033-01-31',
  2034: '2034-02-19',
  2035: '2035-02-08',
  2036: '2036-01-28',
  2037: '2037-02-15',
  2038: '2038-02-04',
  2039: '2039-01-24',
  2040: '2040-02-12',
  2041: '2041-02-01',
  2042: '2042-01-22',
  2043: '2043-02-10',
};

@Command('demngaytetam', {
  usage: '*demngaytetam',
})
export class LunarNewYearCountDownCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  getNextLunarNewYearCountdown() {
    const today = dayjs().format('YYYY-MM-DD');
    const years = Object.keys(lunarNewYearDates)
      .map(Number)
      .sort((a, b) => a - b);

    for (const year of years) {
      const date = dayjs(lunarNewYearDates[year]);
      if (date.isSame(today, 'day')) {
        return {
          year,
          date: date.format('YYYY-MM-DD'),
          daysLeft: 0,
          isToday: true,
        };
      }

      if (date.isAfter(today, 'day')) {
        const daysLeft = date.diff(today, 'day');
        return {
          year,
          date: date.format('YYYY-MM-DD'),
          daysLeft,
          isToday: false,
        };
      }
    }
    return null;
  }
  async execute(args: string[], message: ChannelMessage) {
    const messageChannel = await this.getChannelMessage(message);
    let title = '⌛️ Đếm ngược đến Tết Nguyên Đán';

    const nextNY = this.getNextLunarNewYearCountdown();

    const daysLeft = nextNY ? nextNY.daysLeft : 0;

    let number: number[] = [0, 0, 0];
    const digits = daysLeft.toString().split('').map(Number);

    if (nextNY.isToday) {
      title = '🎉 Chúc mừng năm mới!';
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
                'https://cdn.mezon.ai/1840653661416460288/1958044376819044352/1803263641638670300/1755873430243_Frame_7__1_.png',
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
