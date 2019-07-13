/**
 * Purpose of this file is for committing files to be used when creating react apps
 */

const fs = require('fs');
const logger = require('./logger');

module.exports = file => {
  const filePath = `${process.cwd()}/${file}`;
  const writeFilePath = `${__dirname}/commited-files/${file}`;

  if (fs.existsSync(filePath)) {
    let fileData = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(writeFilePath, fileData);
    logger.success(`File "${file}" successfully committed`);
  } else {
    logger.error(`"${file}" does not exist.\nCurrently look for file at: ${filePath}`);
  }
};
