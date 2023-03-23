declare module 'discord.js' {
    export interface User {
        /** the amount of messages required until they get XP from a message again */
        untilNextXP: number;
    }
}

export {};