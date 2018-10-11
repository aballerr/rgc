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
  .option('-n, --no-style', 'it will not create a stylesheet if you have one configured')
  .option('-o, --overwrite', 'will overwrites file it if exists')
  .description('generates a new component')
  .action(function (name, cmd) {
    const options = config.get();

    if (cmd.pure)
      options.componentType = 'pure';
    if (!cmd.style)
      options.cssType = 'none';

    options.overwrite = cmd.overwrite;
    commandActions.buildReactComponent(name, options);
  });

program
  .command('config')
  .description('allows you to set up your own personalize configuration')
  .action(function () {
    setConfigOptions();
  });

program
  .command('print')
  .description('Prints out your currently configured options')
  .action(function () {
    printConfigOptions();
  });

program.parse(process.argv);


function setConfigOptions() {
  inquirer
    .prompt(questions)
    .then((answers) => {
      config.set(answers);
    })
    .catch((err) => console.log(err));
}

function printConfigOptions() {
  console.log(chalk.bold("\nYour config options are:\n"));
  let configOptions = config.get();
  let keys = Object.keys(configOptions);

  for (let i of keys) {
    console.log((`${chalk.bold(i)}: ${configOptions[i]}`));
  }
  console.log();
}
