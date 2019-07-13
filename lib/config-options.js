/**
 * This file takes care of all the basic configurations a user can set
 */

const chalk = require('chalk');
const fs = require('fs');
const config = require('./configstore');
const inquirer = require('inquirer');
const { bold } = require('./logger');
const questions = require('./questions');

//Print out the current configuration options
function printConfigOptions() {
  bold('\nYour config options are:\n');
  let files = fs.readdirSync(`${__dirname}/../committed-files`);
  let configOptions = config.get();
  let keys = Object.keys(configOptions);

  for (let key of keys) {
    console.log(`${chalk.bold(key)}: ${configOptions[key]}`);
  }

  if (files.length) {
    bold('\n\nYour file(s) are:\n');
    for (let file of files) {
      console.log(file);
    }
  } else {
    bold('\n\nYou have no committed files\n');
  }
  console.log();
}

//Allow user to set their configuration options
function setConfigOptions() {
  inquirer
    .prompt(questions)
    .then(answers => config.set(answers))
    .catch(err => console.log(err));
}

// Set up the options for the component generator
function getOptions(cmd) {
  let options = config.get();
  let { pure, style, dir, test } = cmd;

  if (pure) options.componentType = 'pure';

  if (style) options.cssType = typeof style === 'string' ? style : '.css';

  if (dir) options.placeInOwnDirectory = true;

  if (test) options.includeTest = true;

  options.overwrite = cmd.overwrite;

  return options;
}

module.exports = {
  printConfigOptions,
  setConfigOptions,
  getOptions,
};
