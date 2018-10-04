#! /usr/bin/env node

'use strict';
// this is for development only
const perf = require('execution-time')();
perf.start();


const chalk = require('chalk');
const program = require('commander');
const version = require('./package.json')['version'];
const inquirer = require('inquirer');
const fileBuilder = require('./fileBuilder');
const config = require('./bin/configstore');

const questions = require('./bin/questions');
const currentPath = process.cwd();




program
  .version(version)
  .usage('new component_name [options]')
  .command('new <component>')
  .option('-p, --pure', 'creates a pure component')
  .description('generates a new component')
  .action(function (component, cmd) {
    const options = config.get();
    const fb = new fileBuilder(component, options, currentPath);
    fb.writeReactComponent();
    console.log('working');
  });

program
  .option('-c, --config', 'Set up configuration', setConfigOptions)
  .option('--print', 'Print your current config options', printConfigOptions)


program.arguments('<arg>').action( (arg) => {
  console.log(chalk.red(`\nInvalid command "${arg}", please below for valid commands.\n`));
  program.outputHelp();
});


program.parse(process.argv);

if(!program.args.length){
  console.log(chalk.red('\nNo command given, please check below for valid commands\n'));
  program.outputHelp();
}







function setConfigOptions() {
  inquirer
    .prompt(questions)
    .then((answers) => {
      config.set(answers);
    })
    .catch((err) => console.log(err));
}

function printConfigOptions() {
  console.log(chalk.green("\nYour config options are:\n"));
  console.log(config.get());
  console.log()
}


const results = perf.stop();
console.log(results.time);