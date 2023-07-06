'use strict';

const {exit} = require('process');

/** @private @constant */
var green = '\x1b[32m';
/** @private @constant */
var red = '\x1b[0;31m';
/** @private @constant */
var reset = '\x1b[0m';
/** @private @constant */
const exec = require('child_process').exec;
/** @private @constant */
const join = require('path').join;
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
        exec(d, {cwd: join(__dirname, '..')}, ((err, stdout, stderr) => {
            if(err) {
                rej(err);
                exit(2);
            } else {
                re({stdout, stderr})
            }
        }));
    });
}

async function runCmd(d, m) {
    return new Promise((res, rej) => {
        cmd(d)
            .then(({stderr}) => {
                if(stderr) {
                    console.log(`${color(red, '! ' + stderr)}`);
                    exit(2);
                }

                console.log(`${color(green, '*')} ${m}`)
                res(0);
            })
            .catch((e) => {
                console.error(`${color(red, '! ' + e)}`);
                exit(2);
            });
    })
}

async function start() {
    var start = Date.now();
    console.log('Starting setup script..');
    Promise.all([
        runCmd('cat .env.example > .env', 'Copied default configuration to `.env`.'), // friendly way to `mv` that doesnt restrict to bash, powershell can run this too! :D
        runCmd('npm install --quiet --no-progress --include=dev', 'Finished installing packages.'),
        runCmd('npx prisma generate', 'Finished generating Prisma files.'),
        runCmd('npx --package typescript tsc', 'Finished transpiling Typescript to Javascript.')
    ])
        .then((values) => {
            values = values;
            console.log(`${color(green, '*')} Finished setting up in ${Date.now() - start}ms.`)
        });
}

start()
    .catch((e) => e);