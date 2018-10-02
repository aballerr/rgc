#! /usr/bin/env node

'use strict';
const fs = require('fs-extra');

const argv = process.argv;
const chalk = require('chalk');
const program = require('commander');
const prompt = require('prompt');
const version = require('./package.json')['version'];
const inquirer = require('inquirer');
const cosmiconfig = require('cosmiconfig');
const explorer = cosmiconfig();

const path = require('path');

const questions = require('./dist/questions');
const currentPath = process.cwd();
const pureComponentTemplate = path.join(__dirname, './dist/templates/PureComponent.jsx');
const ComponentTemplate = path.join(__dirname, './dist/templates/Component.jsx');




program.version(version)
  .usage('component_name [options]')
  .option('-p, --pure', 'Create a Pure Component')
  .option('-c, --config', 'Set up your configuration', setConfigOptions)
  .parse(argv);



if (argv.length < 3) {
  console.log(chalk.red('Hi, you enetered for few arguments.  Try --help for for options and an example.'))
} else if (program.config) {

} else {
  createComponent();
}



function setConfigOptions() {
  inquirer
    .prompt(questions)
    .then(answers => {
      console.log(answers)
      fs.writeFile('rgc.config.js', `module.exports = ${JSON.stringify(answers)}`, 'utf8', (success, err) => {
        if (err) console.log(err);
        console.log(chalk.blue('Succesfully created.'));
      })
      // Use user feedback for... whatever!!
    })
    .catch(err => console.log(err));

}




function createComponent() {
  const name = argv[2]
  const options = loadConfigOptions();
  console.log(options.jsExtensions)
  const template = options.componentType === 'pure' ? pureComponentTemplate : ComponentTemplate;

  fs.readFile(template, 'utf8').then(response => {
      const newFile = nameComponent(response, name);
      fs.outputFile(`${currentPath}/${name}${options.jsExtensions}`, newFile, err => {
        if (err) console.error(err);

          console.log(chalk.green(`Successfully created ${name}.jsx`));
        
      });
    })
    .catch(err => console.error(err));
}


// loads the configuration if it exists otherwise just loads a default
function loadConfigOptions() {
  try {

    return explorer.loadSync('./rgc.config.js').config
    //return explorer.loadSync('./rgc.config.js');
    return {
      "propsValidation": true,
      "jsExtensions": ".jsx",
      "componentType": "class",
      "cssType": "none"
    }
  } catch (err) {
    console.log('what about this')
  }
  console.log('does this run')
  return {
    "propsValidation": true,
    "jsExtensions": ".jsx",
    "componentType": "class",
    "cssType": "none"
  }
}

// This function takes in the template text and replacess the template filler name with the actual name
function nameComponent(text, name) {
  return text.replace(/\bREACT_TEMPLATE\b/g, name).replace(/\bREACT_TEMPLATE_CLASSNAME\b/, name.toLowerCase());
}
