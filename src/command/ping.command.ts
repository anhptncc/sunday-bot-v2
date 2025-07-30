import { ChannelMessage } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';

@Command('ping', {
    description: 'Check bot latency and responsiveness',
    usage: '!ping',
    category: 'Utility',
    aliases: ['p'],
})
export class PingCommand extends CommandMessage {
    execute(args: string[], message: ChannelMessage) {
        const timestamp = Date.now();
        const messageContent = `🏓 Pong! Response time: ${timestamp - parseInt(message.create_time)}ms`;
        
        return this.replyMessageGenerate({ messageContent }, message);
    }
}
