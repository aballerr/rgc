const chalk = require('chalk');

module.exports.success = function(message) {
  console.log(chalk.green(message));
};

module.exports.error = function(message) {
  console.log(chalk.red(message));
};
