/**
 * Purpose of this file is for committing files to be used when creating react apps
 */

const fs = require('fs');
const logger = require('./logger');
const serviceThis = {};

serviceThis.commitFile = file => {
  const filePath = `${process.cwd()}/${file}`;
  const writeFilePath = `${__dirname}/../committed-files/${file}`;

  if (fs.existsSync(filePath)) {
    let fileData = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(writeFilePath, fileData);
    logger.success(`File "${file}" successfully committed`);
  } else {
    logger.error(`"${file}" does not exist.\nCurrently look for file at: ${filePath}`);
  }
};

serviceThis.getCommittedFiles = () => fs.readdirSync(`${__dirname}/../committed-files`);

module.exports = serviceThis;
