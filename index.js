#! /usr/bin/env node

'use strict';
// this is for development only
const perf = require('execution-time')();
perf.start();

const fs = require('fs-extra');
const chalk = require('chalk');
const program = require('commander');
const version = require('./package.json')['version'];
const inquirer = require('inquirer');
const config = require('./bin/configstore');
const pureComponent = require('./templates/pure-component');
const classComponent = require('./templates/class-component');
const questions = require('./bin/questions');
const currentPath = process.cwd();
const touch = require('touch');


program
  .version(version)
  .usage('new component_name [options]')
  .command('new <name>')
  .option('-p, --pure', 'creates a pure component')
  .description('generates a new component')
  .action(function (name) {
    const options = config.get();

    buildReactComponent(name, options);
  });

program
  .option('-c, --config', 'Set up configuration', setConfigOptions)
  .option('--print', 'Print your current config options', printConfigOptions);


program.arguments('<arg>').action((arg) => {
  console.log(chalk.red(`\nInvalid command "${arg}", please below for valid commands.\n`));
  program.outputHelp();
});


program.parse(process.argv);

if (!program.args.length) {
  // console.log(chalk.red('\nNo command given, please check below for valid commands\n'));
  // program.outputHelp();
}



// Builds the react component and it's styling
function buildReactComponent(name, options) {
  const capitalizedName = name.replace(/^\w/, (c) => c.toUpperCase());
  const componetFile = options.componentType === 'class' ? classComponent(name, options) : pureComponent(name, options);
  const reactFileName = `${currentPath}/${capitalizedName}${options.jsExtensions}`;
  const cssFileName = `${currentPath}/${capitalizedName}${options.cssType}`;

  fs.outputFile(reactFileName, componetFile)
    .then(() => {
      console.log(chalk.blue(`Succesfully created ${reactFileName}!`));
      if (options.cssType !== 'none') {
        touch(cssFileName, '');
        console.log(chalk.blue(`Succesfully created ${cssFileName}`));
      }
    })
    .catch((err) => {
      throw err;
    });
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
  console.log();
}

const results = perf.stop();
console.log(results.time);
