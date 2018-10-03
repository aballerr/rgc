#! /usr/bin/env node

'use strict';
// this is for development only
const perf = require('execution-time')();
perf.start();

const fs = require('fs-extra');
const argv = process.argv;
const chalk = require('chalk');
const program = require('commander');
const version = require('./package.json')['version'];
const inquirer = require('inquirer');
const cosmiconfig = require('cosmiconfig');
const touch = require('touch');
const explorer = cosmiconfig();
const fileBuilder = require('./fileBuilder');
const path = require('path');

const questions = require('./dist/questions');
const currentPath = process.cwd();
const pureComponentTemplate = path.join(__dirname, './dist/templates/PureComponent.jsx');
const ComponentTemplate = path.join(__dirname, './dist/templates/Component.jsx');




program.version(version)
  .usage('component_name [options]')
  .option('-p, --pure', 'Create a Pure Component')
  .option('-c, --config', 'Set up your configuration', setConfigOptions)
  .option('--print', 'Print your current config options', printConfigOptions)
  .parse(argv);



if (argv.length < 3) {
  console.log(chalk.red('Hi, you enetered for few arguments.  Try --help for for options and an example.'));
} else if (program.config) {

} else if (program.print) {

}
else {
  createComponent();
}



function setConfigOptions() {
  inquirer
    .prompt(questions)
    .then((answers) => {
      console.log(answers);
      fs.writeFile('rgc.config.js', `module.exports = ${JSON.stringify(answers)}`, 'utf8', (success, err) => {
        if (err) console.log(err);
        console.log(chalk.blue('Succesfully created your confirutations!.'));
      });
      // Use user feedback for... whatever!!
    })
    .catch((err) => console.log(err));

}




function createComponent() {
  const name = argv[2];
  const options = loadConfigOptions();
  const fileName = `${currentPath}/${name}`;
  const cssFileName = `${fileName}${options.cssType}`;


  const fb = new fileBuilder(name, options, currentPath);
  fb.writeReactComponent();
}


// loads the configuration if it exists otherwise just loads a default
function loadConfigOptions() {
  try {

    return explorer.loadSync('./rgc.config.js').config;

  } catch (err) {
    '';
  }

  return {
    "propsValidation": true,
    "jsExtensions": ".jsx",
    "componentType": "class",
    "cssType": "none"
  };
}

// This function takes in the template text and replacess the template filler name with the actual name
function nameComponent(text, name) {
  return text.replace(/\bREACT_TEMPLATE\b/g, name).replace(/\bREACT_TEMPLATE_CLASSNAME\b/, name.toLowerCase());
}

function writePropsValidation(fileToAppend, name) {
  const propsValidation = `\n${name}.propTypes = {};`;
  fs.appendFile(fileToAppend, propsValidation, (err) => {
    if (err) throw err;
  });
}


function printConfigOptions() {

  console.log(chalk.green("\nYour config options are:\n"));
  console.log(loadConfigOptions());
  console.log()
}


const results = perf.stop();
console.log(results.time);