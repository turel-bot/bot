'use strict';

/** @private @constant */
var green = '\x1b[32m';
/** @private @constant */
var red = '\x1b[0;31m';
/** @private @constant */
var reset = '\x1b[0m';
/** @private @constant */
var exec = require('child_process').exec;

/**
 * @param {string} c 
 * @param {string} t 
 * @returns {string}
 */
function color(c, t) {
    return c + t + reset;
}

/**
 * @param {string} d 
 * @returns { Promise<{ stdout: string, stderr: string }> }
 */
async function cmd(d) {
    return new Promise((re, rej) => {
        exec(d, ((err, stdout, stderr) => {
            if(err) {
                rej(err);
            } else {
                re({ stdout, stderr })
            }
        }));
    });
}

async function runCmd(d,m) {
    cmd(d)
    .then(() => console.log(`${color(green, '*')} ${m}`))
    .catch(console.error);
}

async function start() {
    var start = Date.now();
    await runCmd('cat .env.example > .env', 'Copied default configuration to `.env`.'); // friendly way to `mv` that doesnt restrict to bash, powershell can run this too! :D
    await runCmd('npm ci --quiet --no-progress', 'Finished installing packages.');
    await runCmd('npx prisma generate', 'Finished generating Prisma files.');
    await runCmd('npx tsc', 'Finished transpiling Typescript to Javascript.');
    console.log(`${color(green, '*')} Finished setting up in ${Date.now() - start}ms.`);
}

start()
    .catch((e) => e);