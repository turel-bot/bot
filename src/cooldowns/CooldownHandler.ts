import type Cooldown from './Cooldown';

/** @private @description the instance of the cooldownhandler (singleton) */
let instance: CooldownHandler | null = null;
class CooldownHandler
{
    /** user id -> array of cooldowns */
    private readonly cooldowns: Map<string, Cooldown[]> = new Map();

    public addCooldown(userId: string, cooldown: Cooldown): void
    {
        let query = this.cooldowns.get(userId);

        if(query && typeof query !== 'undefined') query.push(cooldown);
        else query = [cooldown];

        this.cooldowns.set(userId, query);
    }

    public getCooldown(userId: string, name: string): Cooldown | null
    {
        const query = this.cooldowns.get(userId);

        if(!query || query === null)
            return null;

        for(let i: number = 0; i < query.length; i++)
        {
            if(query[i] === null || query[i] === undefined)
                continue;
                
            if(query[i].commandName !== name)
                continue;

            return query[i];
        }

        return null;
    }

    public getCooldowns(userId: string): Cooldown[] | null
    {
        const query = this.cooldowns.get(userId);

        if(!query || query === null)
            return null;

        return query;
    }

    public removeCooldown(userId: string, cooldown: Cooldown): true | null
    {
        const cooldowns: any[] | null = this.getCooldowns(userId);

        if(cooldowns === null)
            return null;

        for(let i: number = 0; i < cooldowns.length; i++)
            if(cooldowns[i].commandName === cooldown.commandName)
            {
                cooldowns[i] = null;
                return true;
            }

        return null;
    }

    public static getInstance(): CooldownHandler
    {
        return (instance ? instance : instance = new CooldownHandler());
    }
}

export default CooldownHandler;