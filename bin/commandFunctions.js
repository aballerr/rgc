const currentPath = process.cwd();
const fs = require('fs-extra');
const pureComponent = require('../templates/pure-component');
const classComponent = require('../templates/class-component');
const chalk = require('chalk');
const touch = require('touch');

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



module.exports.buildReactComponent = function(name, options) {
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
};
