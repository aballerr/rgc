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
const abc = require('./bin/commandFunctions');



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

    abc.buildReactComponent(name, options);
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




function getBuildPath(capitalizedName, placeInOwnDirectory, extension) {
  let buildPath = ``;

  if (fs.existsSync(`${currentPath}/src/components`)) {
    buildPath += `src/components/`;
  } else if (fs.existsSync(`${currentPath}/src`)) {
    buildPath += `src/`;
  }

  if (placeInOwnDirectory) {
    buildPath += `${capitalizedName}/${capitalizedName}`;
  } else {
    buildPath += `${capitalizedName}`;
  }

  return buildPath += `${extension}`;
}



// Builds the react component and it's styling
function buildReactComponent(name, options) {
  const capitalizedName = name.replace(/^\w/, (c) => c.toUpperCase());
  const componetFile = options.componentType === 'class' ? classComponent(name, options) : pureComponent(name, options);
  const reactBuildPath = getBuildPath(capitalizedName, options.placeInOwnDirectory, options.jsExtensions);
  const cssBuildPath = getBuildPath(capitalizedName, options.placeInOwnDirectory, options.cssType);
  const reactFileName = `${currentPath}/${reactBuildPath}`;
  const cssFileName = `${currentPath}/${cssBuildPath}`;


  if (fs.existsSync(reactFileName) && !options.overwrite) {
    console.log(chalk.red(`\nERROR: React file already exists at: "${reactBuildPath}"\n`));
  } else {
    fs.outputFile(reactFileName, componetFile)
      .then(() => {
        console.log(chalk.green(`CREATED ${reactBuildPath}`));

        if (fs.existsSync(cssFileName) && !options.overwrite) {
          console.log(chalk.red(`ERROR: CSS file already exists at "${cssBuildPath }"`));
        } else if (options.cssType !== 'none') {
          touch(cssFileName, '');
          console.log(chalk.green(`CREATED ${cssBuildPath}`));
        }
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
  console.log(chalk.bold("\nYour config options are:\n"));
  let configOptions = config.get();
  let keys = Object.keys(configOptions);

  for (let i of keys) {
    console.log((`${chalk.bold(i)}: ${configOptions[i]}`));
  }
  console.log();
}


module.exports = buildReactComponent;