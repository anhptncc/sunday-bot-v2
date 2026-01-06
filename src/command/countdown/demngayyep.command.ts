import * as dayjs from 'dayjs';
import { ChannelMessage, EMessageComponentType } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';
import { createMessageFromMsgReply, getRandomColor } from '@app/utils/helpers';
import { imageItems } from '@app/common/constants';

const happyIconIndex = imageItems.length - 1;

export const settingDates: Record<number, string> = {
  2025: '2026-01-31',
  2026: '2026-12-31',
  2027: '2027-12-31',
};

const settingDesc: Record<number, string> = {
  2025: `Thời gian: Thứ 7, ngày 31/01/2026
            Đối tượng: Toàn thể nhân viên NCC (Staff và Intern)
            Thông tin chi tiết: ims.nccsoft.vn/information/events/836
            Link đăng ký tham gia YEP 2025: forms.gle/K2fYJWVYdpSHpwHq5
            `,
};

@Command('demngayyep', {
  usage: '*demngayyep',
})
export class YepCountDownCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  getNextMidAutumnFestivalCountdown() {
    const today = dayjs().format('YYYY-MM-DD');
    const years = Object.keys(settingDates)
      .map(Number)
      .sort((a, b) => a - b);

    for (const year of years) {
      const date = dayjs(settingDates[year]);
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
    const nextNY = this.getNextMidAutumnFestivalCountdown();

    let title = `⌛️ Đếm ngược đến ngày YEP ${nextNY?.year} ⌛️`;

    const daysLeft = nextNY ? nextNY.daysLeft : 0;

    let number: number[] = [0, 0, 0];
    const digits = daysLeft.toString().split('').map(Number);

    if (nextNY.isToday) {
      title = '🎉 Today is NCC YEP 🎉';
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

    const description = settingDesc[nextNY.year] || undefined;

    const resultEmbed = {
      color: getRandomColor(),
      title,
      description,
      fields: [
        {
          name: '',
          value: '',
          inputs: {
            id: 'slots',
            type: EMessageComponentType.ANIMATION,
            component: {
              url_image:
                'https://cdn.mezon.ai/1803263641638670336/2008491659402153984.png',
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
