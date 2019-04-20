#! /usr/bin/env node
'use strict';
const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const version = require('./package.json')['version'];
const config = require('./lib/configstore');
const questions = require('./lib/questions');
const commandActions = require('./lib/commandActions');

program
  .version(version)
  .usage('help for commands and options')
  .command('new <name>')
  .option('-p, --pure', 'creates a pure component')
  .option('-s, --style [style]', 'it will create a file sheet along with your component')
  .option('-t, --test', 'it will create a test along with your component')
  .option('-d, --dir', "it will place the file in it's own directory")
  .option('-o, --overwrite', 'will overwrites file it if exists')
  .option('-l, --lifecycle', 'it will add life cycle methods')
  .description('generates a new component')
  .action(function(name, cmd) {
    let options = getOptions(cmd);

    commandActions.buildReactComponent(name, options);
  });

program
  .command('config')
  .description('allows you to set up your own personalize configuration')
  .action(function() {
    setConfigOptions();
  });

program
  .command('print')
  .description('Prints out your currently configured options')
  .action(function() {
    printConfigOptions();
  });

program.parse(process.argv);

function setConfigOptions() {
  inquirer
    .prompt(questions)
    .then(answers => {
      config.set(answers);
    })
    .catch(err => console.log(err));
}

// Set up the options for the component generator
function getOptions(cmd) {
  let options = config.get();
  let { pure, style, dir, test } = cmd;

  if (pure) options.componentType = 'pure';

  if (style) {
    if (typeof style === 'string') options.cssType = style;
    else options.cssType = '.css';
  }

  if (dir) {
    options.placeInOwnDirectory = true;
  }

  if (test) {
    options.includeTest = true;
  }

  options.overwrite = cmd.overwrite;

  return options;
}

function printConfigOptions() {
  console.log(chalk.bold('\nYour config options are:\n'));
  let configOptions = config.get();
  let keys = Object.keys(configOptions);

  for (let i of keys) {
    console.log(`${chalk.bold(i)}: ${configOptions[i]}`);
  }
  console.log();
}
