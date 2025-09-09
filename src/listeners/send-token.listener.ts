import { ClientConfigService } from '@app/config/client.config';
import { MezonClientService } from '@app/services/mezon-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events, MezonClient, TokenSentEvent } from 'mezon-sdk';
import { ERROR_MESSAGES } from '@app/common/constants';
import { UserService } from '@app/service/user.service';

@Injectable()
export class EventListenerSendToken {
  private readonly client: MezonClient;
  private readonly logger = new Logger(EventListenerSendToken.name);

  constructor(
    private readonly clientService: MezonClientService,
    private readonly clientConfigService: ClientConfigService,
    private readonly userService: UserService,
  ) {
    this.client = clientService.getClient();
  }

  @OnEvent(Events.TokenSend)
  async handleCommand(tokenEvent: TokenSentEvent): Promise<void> {
    try {
      if (tokenEvent.amount <= 0) return;

      const botId = process.env.BOT_ID;
      if (!botId) {
        console.error('BOT_ID is not defined');
        return;
      }

      if (tokenEvent.receiver_id === botId && tokenEvent.sender_id) {
        await this.userService.createOrUpdateUser({
          userId: tokenEvent.sender_id,
          balance: tokenEvent.amount,
          username: tokenEvent.sender_name,
        });
      }
    } catch (error) {
      this.logger.error(ERROR_MESSAGES.CHANNEL_MESSAGE_PROCESSING, error);
    }
  }
}
