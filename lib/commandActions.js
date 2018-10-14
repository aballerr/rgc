const currentPath = process.cwd();
const fs = require('fs-extra');
const pureComponent = require('../templates/pure-component');
const classComponent = require('../templates/class-component');
const touch = require('touch');
const logger = require('./logger');

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


function isWritable(path, overwrite) {
  return (fs.existsSync(path) && !overwrite);
}

function writeCssFile(cssFileName, cssBuildPath, options) {
  if (isWritable(cssFileName, options.overwrite)) {
    logger.error(`ERROR: CSS file already exists at "${cssBuildPath }"`);
  } else if (options.cssType !== 'none') {
    touch(cssFileName, '');
    logger.success(`CREATED ${cssBuildPath}`);
  }
}

function writeTestFile(testFileName, testBuildPath, options) {
  if (!options.includeTest)
    return;
  if (isWritable(testFileName, options.overwrite)) {
    logger.error(`ERROR: test file already exists at "${cssBuildPath }"`);
    return;
  }
  touch(testFileName, '');
  logger.success(`CREATED ${testBuildPath}`);
}

module.exports.buildReactComponent = function (name, options) {
  const capitalizedName = name.replace(/^\w/, (c) => c.toUpperCase());
  const componetFile = options.componentType === 'class' ? classComponent(name, options) : pureComponent(name, options);
  const reactBuildPath = getBuildPath(capitalizedName, options.placeInOwnDirectory, options.jsExtensions);
  const cssBuildPath = getBuildPath(capitalizedName, options.placeInOwnDirectory, options.cssType);
  const testBuildPath = getBuildPath(capitalizedName, options.placeInOwnDirectory, '.test.js');
  const reactFileName = `${currentPath}/${reactBuildPath}`;
  const cssFileName = `${currentPath}/${cssBuildPath}`;
  const testFileName = `${currentPath}/${testBuildPath}`;


  if (isWritable(reactFileName, options.overwrite)) {
    logger.error(`\nERROR: React file already exists at: "${reactBuildPath}"\n`);
  } else {
    fs.outputFile(reactFileName, componetFile)
      .then(() => {
        logger.success(`CREATED ${reactBuildPath}`);
        writeCssFile(cssFileName, cssBuildPath, options);
        writeTestFile(testFileName, testBuildPath, options);
      })
      .catch((err) => {
        throw err;
      });
  }
};
