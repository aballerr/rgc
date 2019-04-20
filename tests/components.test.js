/* global it, describe, before, after */
const rgc = require('../lib/commandActions');
const expect = require('chai').expect;
const fs = require('fs');
const currentPath = process.cwd();
const rimraf = require('rimraf');
const classComponentPath = `${currentPath}/ClassComponent`;
const templatePath = `${currentPath}/tests/filesToCompare/ClassComponent.jsx`;
const purePath = `${currentPath}/PureComponent`;
const purePathTemplate = `${currentPath}/tests/filesToCompare/PureComponent.jsx`;

before(() => {
  let options = {
    componentType: 'class',
    placeInOwnDirectory: true,
    cssType: '.css',
    jsExtensions: '.jsx',
    createPropsValidation: true,
  };

  rgc('classComponent', options);
  options.componentType = 'pure';
  rgc('pureComponent', options);
});

describe('Testing the create component function', () => {
  it('should create a class component', function(done) {
    fs.readFile(templatePath, 'utf8', (err, testData) => {
      if (err) throw err;
      fs.readFile(`${classComponentPath}/ClassComponent.jsx`, 'utf8', (err, data) => {
        expect(testData).to.equal(data);
        done();
      });
    });
  });

  it('should create a pure component', function(done) {
    fs.readFile(purePathTemplate, 'utf8', (err, testData) => {
      if (err) throw err;
      fs.readFile(`${purePath}/PureComponent.jsx`, 'utf8', (err, data) => {
        expect(testData).to.equal(data);
        done();
      });
    });
  });
});

after(() => {
  console.log(classComponentPath);
  console.log(purePath);
  if (fs.existsSync(classComponentPath)) {
    rimraf(classComponentPath, () => {
      console.log('Bob successfully deleted.');
    });
  }
  if (fs.existsSync(purePath)) {
    rimraf(purePath, () => {
      console.log('Pure successfully deleted');
    });
  }

  // process.exit();
});
