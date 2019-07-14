/**
 * Purpose of this file is for committing files to be used when creating react apps
 */

const fs = require('fs');
const { bold } = require('chalk');
const { error, success } = require('./logger');
const serviceThis = {};

serviceThis.commitFile = (file, cmd) => {
  const { remove, purge, list } = cmd;

  if (remove) {
    _removeFile(file);
  } else if (purge) {
    _purgeFiles();
  } else if (list) {
    _listFiles();
  } else {
    _commitFile(file);
  }
};

serviceThis.getCommittedFiles = () => fs.readdirSync(`${__dirname}/../committed-files`);

const _removeFile = file => {
  const writeFilePath = `${__dirname}/../committed-files/${file}`;

  if (file === undefined) {
    error('No file was provided, please provide a file to remove.');
    return;
  }
  if (!fs.existsSync(writeFilePath)) {
    error(
      `File "${file}" does not exist at: ${writeFilePath}. \nThis probably means the file was not committed.  Please run "rgc commit -l" to see a list of all committed files.`
    );
    return;
  }
  fs.unlinkSync(writeFilePath);
  success(`File "${file}" has successfully been removed from committed files.`);
};

const _commitFile = file => {
  const filePath = `${process.cwd()}/${file}`;
  const writeFilePath = `${__dirname}/../committed-files/${file}`;

  if (fs.existsSync(filePath)) {
    let fileData = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(writeFilePath, fileData);
    success(`File "${file}" successfully committed.`);
  } else {
    error(`"${file}" does not exist.\nCurrently looking for file at: ${filePath}`);
  }
};

const _purgeFiles = () => {
  const files = serviceThis.getCommittedFiles();
  if (files.length === 0) {
    console.log('There are no files to purge.');
    return;
  }

  for (let file of files) {
    const writePath = `${__dirname}/../committed-files/${file}`;
    fs.unlinkSync(writePath);
    success(`Successfully removed ${file} from committed files.`);
  }
  success('All files removed from committed files.');
};

const _listFiles = () => {
  const files = serviceThis.getCommittedFiles();

  if (files.length === 0) {
    console.log('You currently have no files committed.');
    return;
  }
  console.log('\nYour currently committed files are:');
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`${i + 1}. ${bold(file)}`);
  }
  console.log();
};

module.exports = serviceThis;
