import {
  ChannelMessage,
  ChannelMessageContent,
  EMarkdownType,
} from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';
import { UserService } from '@app/service/user.service';
import { User } from '@app/entities/user.entity';
import * as dayjs from 'dayjs';

interface BuddhistRank {
  name: string;
  minDays: number;
  maxDays?: number;
}

@Command('demngayditu', {
  description: 'Manages Buddhist ordination tracking and rank progression',
})
export class DemNgayDiTuCommand extends CommandMessage {
  private static readonly BUDDHIST_RANKS: BuddhistRank[] = [
    { name: 'Sa-di', minDays: 0, maxDays: 29 },
    { name: 'Đại đức', minDays: 30, maxDays: 59 },
    { name: 'Thượng tọa', minDays: 60, maxDays: 89 },
    { name: 'Hòa thượng', minDays: 90 },
  ];

  private static readonly MAX_DHARMA_NAME_LENGTH = 100;

  private static readonly MESSAGES = {
    EMPTY_DHARMA_NAME: 'Pháp danh không được để trống. Vui lòng thử lại nhé!',
    DHARMA_NAME_TOO_LONG:
      'Pháp danh dài như nghiệp của thí chủ vậy sao? Hãy thử lại nhé!',
    NOT_INITIALIZED:
      'Thí chủ chưa cập nhật pháp danh và ngày xuất gia. \nVui lòng sử dụng lệnh sau để bắt đầu đi tu:\n*demngayditu start [pháp danh]',
    DHARMA_NAME_UPDATED: (name: string) =>
      `Pháp danh đã được cập nhật thành: ${name}`,
    BLESSING:
      '🕊️ Kính chúc quý Thầy thân tâm thường an lạc, đạo nghiệp viên thành, Phật sự viên mãn.',
  } as const;

  constructor(
    clientService: MezonClientService,
    private readonly userService: UserService,
  ) {
    super(clientService);
  }

  private calculateStudyDays(ordinationDate: Date): number {
    return dayjs().diff(dayjs(ordinationDate), 'day');
  }

  private getBuddhistRank(studyDays: number): string {
    const rank = DemNgayDiTuCommand.BUDDHIST_RANKS.find(
      (rank) =>
        studyDays >= rank.minDays &&
        (rank.maxDays === undefined || studyDays <= rank.maxDays),
    );
    return rank?.name || 'Sa-di';
  }

  private buildBuddhistMessage(
    dharmaName: string,
    ordinationDate: Date,
  ): string {
    const studyDays = this.calculateStudyDays(ordinationDate);
    const rank = this.getBuddhistRank(studyDays);

    return [
      `🪷 Pháp danh: ${dharmaName}`,
      `📿 Học vị: ${rank}`,
      `📅 Ngày xuất gia: ${dayjs(ordinationDate).format('DD/MM/YYYY')}`,
      `🧘 Thời gian tu học: ${studyDays.toLocaleString()} ngày`,
      DemNgayDiTuCommand.MESSAGES.BLESSING,
    ].join('\n');
  }

  private validateDharmaName(dharmaName: string): string | null {
    if (!dharmaName || dharmaName.trim().length === 0) {
      return DemNgayDiTuCommand.MESSAGES.EMPTY_DHARMA_NAME;
    }
    if (dharmaName.length > DemNgayDiTuCommand.MAX_DHARMA_NAME_LENGTH) {
      return DemNgayDiTuCommand.MESSAGES.DHARMA_NAME_TOO_LONG;
    }
    return null;
  }

  private isUserInitialized(user: User): boolean {
    return !!(user.dharmaName && user.ordinationDate);
  }

  private async handleStartCommand(
    args: string[],
    user: User,
    userId: string,
  ): Promise<string> {
    if (this.isUserInitialized(user)) {
      return this.buildBuddhistMessage(user.dharmaName, user.ordinationDate);
    }

    const dharmaName = this.getDharmaName(args);
    const validationError = this.validateDharmaName(dharmaName);
    if (validationError) {
      return validationError;
    }

    const ordinationDate = new Date();
    await this.userService.updateUser({
      userId,
      dharmaName,
      ordinationDate,
    });

    return this.buildBuddhistMessage(dharmaName, ordinationDate);
  }

  private async handleRenameCommand(
    args: string[],
    user: User,
    userId: string,
  ): Promise<string> {
    if (!this.isUserInitialized(user)) {
      return DemNgayDiTuCommand.MESSAGES.NOT_INITIALIZED;
    }

    const userBalance = Number(user.balance) || 0;
    if (userBalance < 5000) {
      return 'Thí chủ cần công đức 5000 token để đổi pháp danh.';
    }

    const newDharmaName = this.getDharmaName(args);
    const validationError = this.validateDharmaName(newDharmaName);
    if (validationError) {
      return validationError;
    }

    this.userService.updateUser({
      userId,
      dharmaName: newDharmaName,
      balance: userBalance - 5000,
    });

    this.userService.updateBotBalance(5000);

    return DemNgayDiTuCommand.MESSAGES.DHARMA_NAME_UPDATED(newDharmaName);
  }

  private handleDisplayCommand(user: User): string {
    if (!this.isUserInitialized(user)) {
      return DemNgayDiTuCommand.MESSAGES.NOT_INITIALIZED;
    }

    return this.buildBuddhistMessage(user.dharmaName, user.ordinationDate);
  }

  private createMessageContent(contentMsg: string): ChannelMessageContent {
    return {
      t: contentMsg,
      mk: [
        {
          type: EMarkdownType.PRE,
          s: 0,
          e: contentMsg.length,
        },
      ],
    };
  }

  async execute(args: string[], message: ChannelMessage): Promise<void> {
    const messageChannel = await this.getChannelMessage(message);
    const user = await this.userService.findUserOrCreate({
      userId: message.sender_id,
      username: message.username,
    });

    let contentMsg: string;
    const command = args[0]?.toLowerCase();

    switch (command) {
      case 'start':
        contentMsg = await this.handleStartCommand(
          args,
          user,
          message.sender_id,
        );
        break;
      case 'rename':
        contentMsg = await this.handleRenameCommand(
          args,
          user,
          message.sender_id,
        );
        break;
      default:
        contentMsg = this.handleDisplayCommand(user);
        break;
    }

    const content = this.createMessageContent(contentMsg);
    const mentions = [];

    messageChannel.reply(content, mentions);
  }

  private getDharmaName(args: string[]): string {
    return args.slice(1).join(' ').replace(/\s+/g, ' ').trim();
  }
}
