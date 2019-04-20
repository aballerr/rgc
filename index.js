#! /usr/bin/env node
'use strict';
const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const version = require('./package.json')['version'];
const config = require('./lib/configstore');
const questions = require('./lib/questions');
const commandActions = require('./lib/commandActions');
const shell = require('shelljs');

program
  .version(version)
  .usage('help for commands and options')
  .command('g <name>')
  .option('-p, --pure', 'creates a pure component')
  .option('-s, --style [style]', 'it will create a file sheet along with your component')
  .option('-t, --test', 'it will create a test along with your component')
  .option('-d, --dir', "it will place the file in it's own directory")
  .option('-o, --overwrite', 'will overwrites file it if exists')
  .option('-l, --lifecycle', 'it will add life cycle methods')
  .description('generates a new component')
  .action((name, cmd) => commandActions(name, getOptions(cmd)));

program
  .command('config')
  .description('allows you to set up your own personalize configuration')
  .action(() => setConfigOptions());

program
  .command('print')
  .description('Prints out your currently configured options')
  .action(() => printConfigOptions());

program
  .command('new <name>')
  .description("generates a new react app using Facebook's create-react-app")
  .action(async name => shell.exec(`node_modules/.bin/create-react-app ${name}`));

program.parse(process.argv);

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

function printConfigOptions() {
  console.log(chalk.bold('\nYour config options are:\n'));
  let configOptions = config.get();
  let keys = Object.keys(configOptions);

  for (let key of keys) {
    console.log(`${chalk.bold(key)}: ${configOptions[key]}`);
  }
  console.log();
}
