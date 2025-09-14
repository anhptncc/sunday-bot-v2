import * as dayjs from 'dayjs';
import { ChannelMessage, EMessageComponentType } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';
import { createMessageFromMsgReply, getRandomColor } from '@app/utils/helpers';
import { imageItems } from '@app/common/constants';

const happyIconIndex = imageItems.length - 1;

export const lunarNewYearDates: Record<number, string> = {
  2024: '2024-09-17',
  2025: '2025-10-06',
  2026: '2026-09-25',
  2027: '2027-09-15',
  2028: '2028-10-03',
  2029: '2029-09-22',
  2030: '2030-09-12',
  2031: '2031-10-01',
  2032: '2032-09-20',
  2033: '2033-10-09',
  2034: '2034-09-28',
  2035: '2035-09-17',
  2036: '2036-10-05',
  2037: '2037-09-25',
  2038: '2038-09-15',
  2039: '2039-10-04',
  2040: '2040-09-22',
  2041: '2041-10-11',
  2042: '2042-09-30',
  2043: '2043-09-20',
};

@Command('demngaytrungthu', {
  usage: '*demngaytrungthu',
})
export class MidAutumnFestivalCountDownCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  getNextMidAutumnFestivalCountdown() {
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
    let title = '⌛️ Đếm ngược đến Tết Trung Thu';

    const nextNY = this.getNextMidAutumnFestivalCountdown();

    const daysLeft = nextNY ? nextNY.daysLeft : 0;

    let number: number[] = [0, 0, 0];
    const digits = daysLeft.toString().split('').map(Number);

    if (nextNY.isToday) {
      title =
        '🥮 Chúc mọi người một Tết Trung Thu vui vẻ và hạnh phúc bên gia đình!';
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
                'https://cdn.mezon.ai/1840653661416460288/1958044376819044352/1803263641638670300/1757837228088_trung_thu.png',
              url_position:
                'https://cdn.mezon.ai/1840653661416460288/1958044376819044352/1803263641638670300/1755681221532_countdown.json',
              pool: results,
              repeat: 3,
              duration: 0.35,
              isResult: 0,
            },
          },
        },
      ],
    };

    const messBot = await messageChannel.reply({ embed: [resultEmbed] });

    const msg = createMessageFromMsgReply(messBot, message);

    this.getChannelMessage(msg).then((messageBot) => {
      resultEmbed.fields[0].inputs.component.isResult = 1;
      setTimeout(() => {
        messageBot?.update({ embed: [resultEmbed] });
      }, 1300);
    });
  }
}
