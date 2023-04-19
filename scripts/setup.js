'use strict';


// self running function
new function ()
{
    var start = Date.now();
    // colors
    var green = '\x1b[32m';
    var reset = '\x1b[0m';

    var { exec } = require('child_process');
    Promise.all([
        exec('npm install --quiet --no-progress', (function (e)
        {
            if (e && e instanceof Error)
            {
                console.error('Failed to run installation script, weird.\r\n' + e);
                return;
            }
            console.log(green + '*' + reset + ' Finished installing NPM packages.');
        })),

        exec('npx prisma generate', (function (e)
        {
            if (e && e instanceof Error)
            {
                console.error('Failed to run Prisma Generate, weird.\r\n' + e);
                return;
            }
            console.log(green + '*' + reset + ' Finished running Prisma generate.');
        })),

        exec('npx tsc', (function (e)
        {
            if (e && e instanceof Error)
            {
                console.error('Failed to run TSC, weird.\r\n' + e);
                return;
            }
            console.log(green + '*' + reset + ' Finished transpiling Typescript into Javascript.');
        })),

        exec('cat .env.example > .env', (function (e)
        {
            if (e && e instanceof Error)
            {
                console.error('Failed to run installation script, weird.\r\n' + e);
                return;
            }
            console.log(green + '*' + reset + ' Copied default configuration to `.env`.');
        }))
    ])

    console.log(green + '*' + reset + ' Finished installation script, took ' + Date.now() - start + ' ms.');
}();