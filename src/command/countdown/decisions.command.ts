import { ChannelMessage } from 'mezon-sdk';
import { Command } from '@app/decorators/command.decorator';
import { CommandMessage } from '@app/command/common/command.abstract';
import { MezonClientService } from '@app/services/mezon-client.service';

const url_decisions = 'https://cdn.mezon.ai/1840653661416460288/1958044376819044352/1831531143489392600/1757732597498_decisions.json';

@Command('decision', {
    usage: '*decision',
})
export class DecisionsCommand extends CommandMessage {
    constructor(clientService: MezonClientService) {
        super(clientService);
    }

    async execute(args: string[], message: ChannelMessage) {
        const messageChannel = await this.getChannelMessage(message);

        const res = await fetch(url_decisions);
        const decisions = (await res.json()) as { vi: string; en: string }[];

        const randomQuote = decisions[Math.floor(Math.random() * decisions.length)];
        const resultEmbed = {
            title: "🎲 Random decision",
            description: `${randomQuote.vi}\n${randomQuote.en}`,
        };

        await messageChannel.reply({ embed: [resultEmbed] });
    }
}
