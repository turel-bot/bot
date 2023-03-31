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
    /** @description The ID of the user the cooldown is assigned to. */
    public userId: string;
    /** @description The name of the command. */
    public commandName: string;
    /** @description How long the cooldown should last in seconds */
    public duration: number;
    /** @description The time that the cooldown started at. */
    public startedAt: number;

    /**
     * 
     * @param {string} userId 
     * @param {string} commandName - 
     * @param {number} duration - How long the cooldown should last in seconds. 
     */
    public constructor(userId: string, commandName: string, duration: number)
    {
        this.commandName = commandName;
        this.userId = userId;
        this.duration = duration;
        this.startedAt = Date.now();
    }

    /**
     * @description Date time check to see if a command cooldown is still active.
     * @returns {boolean} Returns true if the cooldown is still active, and false is it is inactive.
     */
    isActive(): boolean
    {
        // rn + that time is before rn
        if(this.startedAt + this.duration <= Date.now())
        {
            CooldownHandler.getInstance().removeCooldown(this.userId, this);
            return false;
        }

        return true;
    }
}

export default Cooldown;