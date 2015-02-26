var chalk = require('chalk');

function onError(err) {
    if (!err) return;
    console.log(chalk.red(err.message || err));
    process.exit(1);
}

function onSuccess(msg) {
    if (!msg) return;
    if (Array.isArray(msg)) msg = msg.join('\n');
    console.log(chalk.green(msg.message || msg));
}

function info(msg) {
    if (!msg) return;
    console.log(chalk.cyan(msg.message || msg));
}

function warn(msg) {
    console.log(chalk.yellow(msg));
}

module.exports = {
    info: info,
    warn: warn,
    onError: onError,
    onSuccess: onSuccess
};