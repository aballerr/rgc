const { bold, green, red } = require('chalk');

const serviceThis = {};

serviceThis.success = message => console.log(green(message));

serviceThis.error = message => console.error(red(message));

serviceThis.bold = message => console.log(bold(message));

module.exports = serviceThis;
