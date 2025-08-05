import * as dayjs from 'dayjs';
import { ChannelMessage } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { CountdownService } from '@app/service/countdown.service';
import { CountdownType } from '@app/entities/countdown.entity';

const messages: string[] = [
  '🌞 Chỉ còn {days} ngày nữa là lương sẽ về, sẵn sàng đón năng lượng mới nhé!',
  '🎉 Chờ đợi đã xong! Lương chỉ còn {days} ngày nữa thôi, chuẩn bị lên kế hoạch chi tiêu nào!',
  '🌷 Đếm ngược nào, {days} ngày nữa là đến ngày lương rồi, chuẩn bị cho mọi dự định nhé!',
  '🎊 Thời gian chờ đợi không lâu nữa, chỉ còn {days} ngày là có lương, tha hồ tận hưởng!',
  '🌻 Lương chỉ còn {days} ngày nữa là đến, chuẩn bị cho tháng mới rực rỡ thôi!',
  '🌞 Thời gian đếm ngược bắt đầu! Chỉ còn {days} ngày nữa là lương về.',
  '🌴 Hãy vui lên, lương chỉ còn {days} ngày nữa là về rồi, tha hồ tận hưởng cuộc sống!',
  '🍂 Ngày chờ đợi đã gần kề, chỉ còn {days} ngày nữa là đến ngày nhận lương!',
  '🎈 Tin vui đây! Chỉ còn {days} ngày nữa là đến ngày lương, bạn đã sẵn sàng chưa?',
  '🎃 Đếm ngược thôi! Chỉ còn {days} ngày là lương về rồi, chuẩn bị chi tiêu hợp lý nhé!',
  '💸 Còn {days} ngày nữa là có tiền trả nợ rồi! Chủ nợ ơi, em sắp có tiền rồi!',
  '🤑 {days} ngày nữa thôi là được ăn mì gói cao cấp rồi các bạn ơi!',
  '🎰 Chỉ còn {days} ngày nữa là có tiền all-in Crypto rồi! To the moon! 🚀',
  '🎮 {days} ngày nữa là có lương rồi! Còn đủ tiền nạp game không các bạn?',
  '🍜 Báo cáo sếp, còn {days} ngày nữa mới có lương, cho em ứng 500k ăn mì tôm!',
  '🏃 Chạy deadline cật lực vì còn {days} ngày nữa mới có lương! Sếp ơi em đói quá!',
  '💰 {days} ngày nữa là có tiền trả góp iPhone 15 rồi! Ăn mì gói cả tháng không sao!',
  '🎵 Còn {days} ngày nữa thôi! Lương về là anh đưa em đi trốn... nợ!',
  '🌙 {days} ngày nữa là lương về! Nhưng mà về thẳng ví chủ nợ mất rồi!',
  '🎪 Còn {days} ngày nữa! Lương chưa về mà bill về đầy nhà!',
];

const luxuryRestaurants = [
  '🥩 El Gaucho – Steak hạng sang cho ngày đặc biệt!',
  '🍣 Sushi Hokkaido Sachi – thưởng sushi như ông hoàng 👑',
  '🍷 The Deck Saigon – view sông + rượu vang = perfect!',
  '🍝 Da Paolo – Italian chuẩn vị cho dân văn phòng sang chảnh!',
  '🥂 Nhà hàng EON 51 – ăn tối trên mây, chill hết cỡ!',
];

@Command('demngaynhanluong', {
  usage: '!demngaynhanluong',
})
export class SalaryCountDownCommand extends CommandMessage {
  constructor(private readonly countdownService: CountdownService) {
    super();
  }

  async execute(args: string[], message: ChannelMessage) {
    const item = await this.countdownService.getCountdownByType(
      CountdownType.PAYDAY,
    );
    const today = dayjs().startOf('day');
    const payday = dayjs(item.targetDate).startOf('day');
    const daysLeft = Math.max(payday.diff(today, 'day'), 0);

    let messageContent = '';

    if (daysLeft === 0) {
      if (item.isFinished) {
        const picked =
          luxuryRestaurants[
            Math.floor(Math.random() * luxuryRestaurants.length)
          ];
        messageContent = `💸 Hôm nay ăn gì nhỉ? Hay là ra:\n${picked}`;
      } else {
        messageContent = '💵 Hãy đợi vài tiếng nữa nhé, lương sẽ về ngay thôi!';
      }
    } else {
      const randomMsg = messages[
        Math.floor(Math.random() * messages.length)
      ].replace('{days}', daysLeft.toString());
      messageContent = randomMsg;
    }

    return this.replyMessageGenerate({ messageContent }, message);
  }
}
