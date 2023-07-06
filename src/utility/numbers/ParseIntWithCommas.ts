/**
 * @description does what the4 name satys someone pleas ewrite actual docs for tyhis i cannot
 * @param {string | bigint | number} int - the number 
 * @returns the number but like without commas and as a number type
 */
const ParseIntWithCommas = <T extends bigint | number>(int: string | T): T | null => {
    if(typeof int === 'undefined' || (!int && int !== 0))
        return null;

    if(typeof int === 'number')
        return int; // are you dumb?

    return BigInt(int.toString().replace('/\D+\,*/g', '')) as T;
};

export default ParseIntWithCommas;