var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message || err));
    process.exit(1);
}

function onSuccess(out) {
    console.log(chalk.green(out.message || out));
}

function info(msg) {
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
}