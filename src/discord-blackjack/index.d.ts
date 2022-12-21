
import type { Message, CommandInteraction, Embed } from 'discord.js';

export default function Main(message: Message | CommandInteraction, options?: MainOptions): Promise<FinalResult>;

interface MainOptions
{
    transition?: 'edit' | 'delete';
    buttons?: boolean;
    doubledown?: boolean;
    split?: boolean;
    resultEmbed?: boolean;
    normalEmbed?: boolean;
    normalEmbedContent?: Embed;
    emojis?: OptionEmojis;
}

interface OptionEmojis
{
    clubs: string | '♣️';
    spades: string | '♠️';
    hearts: string | '♥️';
    diamonds: string | '♦️';
}

interface FinalResult
{
    result: string;
    method: string;
    ycard: Array<Card>;
    dcard: Array<Card>;
    message?: Message;
}

interface Card
{
    suit: string;
    rank: string;
    value: number;
    emoji: string;
}