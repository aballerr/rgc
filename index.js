#! /usr/bin/env node

'use strict';


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
  .usage('help for commands and options')
  .command('new <name>')
  .option('-p, --pure', 'creates a pure component')
  .description('generates a new component')
  .action(function (name, cmd) {
    const options = config.get();

    if (cmd.pure)
      options.componentType = 'pure';
    buildReactComponent(name, options);
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



program.arguments('<arg>').action((arg) => {
  // console.log(chalk.red(`\nInvalid command "${arg}", please below for valid commands.\n`));
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


  if (fs.existsSync(reactFileName)) {
    console.log(chalk.red(`\nERROR: React file already exists at: "${reactFileName}"\n`));
  } else {
    fs.outputFile(reactFileName, componetFile)
      .then(() => {
        console.log(chalk.green(`\nSUCCESS: Created ${capitalizedName}${options.jsExtensions}`));

        if (fs.existsSync(cssFileName)) {
          console.log(chalk.red(`ERROR: CSS file already exists at "${cssFileName}"`));
        } else if (options.cssType !== 'none') {
          touch(cssFileName, '');
          console.log(chalk.green(`SUCCESS: Created ${capitalizedName}${options.cssType}`));
        }
        console.log();
      })
      .catch((err) => {
        throw err;
      });
  }
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
