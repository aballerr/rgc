const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { getCommittedFiles } = require('./commit-files');

module.exports = async name => {
  let nodeModulesPath = path.join(__dirname, `../node_modules/.bin/create-react-app ${name}`);
  await shell.exec(nodeModulesPath);
  let files = getCommittedFiles();

  if (files.length) {
    for (let file of files) {
      let filepath = `${process.cwd()}/${name}/${file}`;
      let filereadpath = `${__dirname}/../committed-files/${file}`;
      console.log(filereadpath);
      let readfile = fs.readFileSync(filereadpath, 'utf8');
      fs.writeFileSync(filepath, readfile);
      console.log(`Successfully written ${file} to ${filepath}`);
    }
  }
};
