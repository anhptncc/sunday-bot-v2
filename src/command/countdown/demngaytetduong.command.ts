import * as dayjs from 'dayjs';
import { ChannelMessage, EMessageComponentType } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';
import { createMessageFromMsgReply, getRandomColor } from '@app/utils/helpers';
import { imageItems } from '@app/common/constants';

const happyIconIndex = imageItems.length - 1;

@Command('demngaytetduong', {
  usage: '*demngaytetduong',
})
export class NewYearCountDownCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  getNextNewYearCountdown() {
    const today = dayjs().format('YYYY-MM-DD');
    const currentYear = dayjs(today).year();

    let newYear = dayjs(`${currentYear}-01-01`);

    if (dayjs(today).isSame(newYear, 'day')) {
      return {
        year: currentYear,
        date: newYear.format('YYYY-MM-DD'),
        daysLeft: 0,
        isToday: true,
      };
    }

    if (dayjs(today).isAfter(newYear, 'day')) {
      newYear = dayjs(`${currentYear + 1}-01-01`);
    }

    const daysLeft = newYear.diff(today, 'day');

    return {
      year: newYear.year(),
      date: newYear.format('YYYY-MM-DD'),
      daysLeft,
      isToday: false,
    };
  }

  async execute(args: string[], message: ChannelMessage) {
    const messageChannel = await this.getChannelMessage(message);
    let title = '⌛️ Đếm ngược đến Tết dương lịch';

    const nextNY = this.getNextNewYearCountdown();

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
