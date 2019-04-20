const fs = require('fs-extra');
const touch = require('touch');
const currentPath = process.cwd();
const pureComponent = require('../templates/pure-component');
const classComponent = require('../templates/class-component');
const logger = require('./logger');

module.exports = (name, options) => {
  options.cssType = isAStyleType(options.cssType);
  const capitalizedName = name.replace(/^\w/, c => c.toUpperCase());
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
        writeStyleFile(cssFileName, cssBuildPath, options);
        writeTestFile(testFileName, testBuildPath, options, capitalizedName);
      })
      .catch(err => {
        throw err;
      });
  }
};

function getBuildPath(capitalizedName, placeInOwnDirectory, extension) {
  let buildPath = ``;

  if (fs.existsSync(`${currentPath}/src/components`)) {
    buildPath += `src/components/`;
  } else if (fs.existsSync(`${currentPath}/src`)) {
    buildPath += `src/`;
  } else if (fs.existsSync(`${currentPath}/components`)) {
    buildPath += `components/`;
  }

  if (placeInOwnDirectory) {
    buildPath += `${capitalizedName}/${capitalizedName}`;
  } else {
    buildPath += `${capitalizedName}`;
  }

  return (buildPath += `${extension}`);
}

function writeStyleFile(cssFileName, cssBuildPath, options) {
  if (isWritable(cssFileName, options.overwrite)) {
    logger.error(`ERROR: CSS file already exists at "${cssBuildPath}"`);
  } else if (options.cssType !== 'none' && options.cssType !== 'styled-components') {
    touch(cssFileName, '');
    logger.success(`CREATED ${cssBuildPath}`);
  }
}

function writeTestFile(testFileName, testBuildPath, options, capitalizedName) {
  if (!options.includeTest) return;
  if (isWritable(testFileName, options.overwrite)) {
    logger.error(`ERROR: test file already exists at "${testBuildPath}"`);
    return;
  }
  fs.writeFileSync(testBuildPath, `import ${capitalizedName} from './${capitalizedName}';`);
  logger.success(`CREATED ${testBuildPath}`);
}

// Checks if we can write the output file
function isWritable(path, overwrite) {
  return fs.existsSync(path) && !overwrite;
}

// If they pass a style type via the option -s, we need to just regex for other cases
// so, mayybe they misunderstand and do app.css instead of just .css
function isAStyleType(cssType) {
  if (cssType.match(/css/)) {
    return '.css';
  }

  if (cssType.match(/scss/)) {
    return '.scss';
  }

  if (cssType.match(/sass/)) {
    return '.sass';
  }

  if (cssType.match(/less/)) {
    return '.less';
  }

  if (cssType.match(/styled/)) {
    return 'styled-components';
  }
  return 'none';
}
