import { ClientConfigService } from '@app/config/client.config';
import { BotGateway } from '@app/gateway/bot.gateway';
import { EventListenerChannelMessage } from '@app/listeners';
import { CommandService } from '@app/services/command.service';
import { MessageCommand } from '@app/services/message-command.service';
import { MessageQueue } from '@app/services/message-queue.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countdown } from '@app/entities/countdown.entity';
import { CountdownService } from '@app/service/countdown.service';
import { UserService } from '@app/service/user.service';
import { EventListenerSendToken } from '@app/listeners/send-token.listener';

import { SalaryCountDownCommand } from '@app/command/countdown/demngaynhanluong.command';
import { LunarNewYearCountDownCommand } from '@app/command/countdown/demngaytetam.command';
import { NewYearCountDownCommand } from '@app/command/countdown/demngaytetduong.command';
import { ChristmasCountDownCommand } from '@app/command/countdown/demngaygiangsinh.command';
import { User } from '@app/entities/user.entity';
import { AdminCommand } from '@app/command/admin/admin.command';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Countdown, User]),
  ],
  providers: [
    BotGateway,
    ClientConfigService,
    ConfigService,
    CommandService,
    MessageQueue,
    MessageCommand,
    CountdownService,
    UserService,

    // Listeners
    EventListenerChannelMessage,
    EventListenerSendToken,

    // Commands
    SalaryCountDownCommand,
    LunarNewYearCountDownCommand,
    NewYearCountDownCommand,
    ChristmasCountDownCommand,
    AdminCommand,
  ],
  controllers: [],
})
export class BotModule {}
