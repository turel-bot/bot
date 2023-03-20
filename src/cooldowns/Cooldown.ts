import CooldownHandler from './CooldownHandler';

interface ICooldown
{
    userId: string;
    commandName: string;
    duration: number;
    startedAt: number;
    /**
     * @description Checks if the cooldown is still active.
     */
    isActive(): boolean;
}

/**
 * @description represents a user's cooldown status per command
 * @author AceLikesGhosts
 */
class Cooldown implements ICooldown
{
    public userId: string;
    public commandName: string;
    public duration: number;
    public startedAt: number;

    public constructor(userId: string, commandName: string, duration: number)
    {
        this.commandName = commandName;
        this.userId = userId;
        this.duration = duration;
        this.startedAt = Date.now();
    }

    isActive(): boolean
    {
        // rn + that time is before rn
        if(this.startedAt + this.duration >= Date.now())
        {
            CooldownHandler.getInstance().removeCooldown(this.userId, this);
            return false;
        }

        return true;
    }
}

export default Cooldown;