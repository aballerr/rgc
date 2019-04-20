const chalk = require('chalk');

const serviceThis = {};

serviceThis.success = message => console.log(chalk.green(message));

serviceThis.error = message => console.error(chalk.red(message));

module.exports = serviceThis;
