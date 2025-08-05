import { HelpCommand } from '@app/command/help.command';
import { PingCommand } from '@app/command/ping.command';
import { AboutCommand } from '@app/command/about.command';
import { ClientConfigService } from '@app/config/client.config';
import { BotGateway } from '@app/gateway/bot.gateway';
import { EventListenerChannelMessage } from '@app/listeners';
import { CommandService } from '@app/services/command.service';
import { MessageCommand } from '@app/services/message-command.service';
import { MessageQueue } from '@app/services/message-queue.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SalaryCountDownCommand } from '@app/command/countdown/demngaynhanluong.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countdown } from '@app/entities/countdown.entity';
import { CountdownService } from '@app/service/countdown.service';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Countdown])],
  providers: [
    BotGateway,
    ClientConfigService,
    ConfigService,
    CommandService,
    MessageQueue,
    MessageCommand,
    CountdownService,

    // Listeners
    EventListenerChannelMessage,

    // Commands
    HelpCommand,
    PingCommand,
    AboutCommand,

    SalaryCountDownCommand,
  ],
  controllers: [],
})
export class BotModule {}
