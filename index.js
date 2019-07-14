#! /usr/bin/env node
'use strict';
const program = require('commander');

const fs = require('fs');
const generateComponent = require('./lib/component-generation');
const generateNewReactApp = require('./lib/react-app-generation');
const { commitFile } = require('./lib/commit-files');
const { getOptions, printConfigOptions, setConfigOptions } = require('./lib/config-options');
const version = require('./package.json')['version'];

//If committed-files folder does not exist, create
const folderPath = `${__dirname}/committed-files/`;
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

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
  .action((name, cmd) => generateComponent(name, getOptions(cmd)));

program
  .command('new <name>')
  .description("generates a new react app using Facebook's create-react-app")
  .action(name => generateNewReactApp(name));

program
  .command('config')
  .description('allows you to set up your own personalize configuration')
  .action(() => setConfigOptions());

program
  .command('commit [file]')
  .description('Allows you to commit your own presets, such as a .eslint file or a .prettierfile, etc')
  .option('-r, --remove', 'removes specified file name')
  .option('-p, --purge', 'removes all committed files')
  .option('-l, --list', 'lists all committed files')
  .action((file, cmd) => commitFile(file, cmd));

program
  .command('print')
  .description('Prints out your currently configured options')
  .action(() => printConfigOptions());

program.parse(process.argv);
