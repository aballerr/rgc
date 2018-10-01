#! /usr/bin/env node

'use strict';
const fs = require('fs-extra');
const pureComponentTemplate = './templates/PureComponent.jsx';
const ComponentTemplate = './templates/Component.jsx';
const argv = process.argv;
const chalk = require('chalk');
const program = require('commander');
const prompt = require('prompt');
const version = require('./package.json')['version'];
const inquirer = require('inquirer');
const questions = require('./dist/questions');


program.version(version)
  .usage('component_name [options]')
  .option('-p, --pure', 'Create a Pure Component')
  .option('-c, --config', 'Set up your configuration', config)
  .parse(argv);


if (argv.length < 3) {
  console.log(chalk.red('Hi, you enetered for few arguments.  Try --help for for options and an example.'))
}



function config() {
  inquirer
    .prompt(questions)
    .then(answers => {
      console.log(answers)
      // Use user feedback for... whatever!!
    })
    .catch(err => console.log(err));

}



function createComponent() {
  const name = argv[2]

  const template = program.pure ? pureComponentTemplate : ComponentTemplate;

  fs.readFile(template, 'utf8').then(response => {
    const newFile = nameComponent(response, name);
    fs.outputFile(`${name}.jsx`, newFile, err => {
      if (err) console.error(err);
      console.log(chalk.green(`Successfully create ${name}.jsx`));
    })

  })
    .catch(err => console.error(err));
}


// This function takes in the template text and replacess the template filler name with the actual name
function nameComponent(text, name) {
  return text.replace(/\bREACT_TEMPLATE\b/g, name).replace(/\bREACT_TEMPLATE_CLASSNAME\b/, name.toLowerCase());
}
