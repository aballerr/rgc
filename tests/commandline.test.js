/* eslint-disable */
/* global it, describe, before, after */
const shellExec = require('shell-exec');
const expect = require('chai').expect;
const fs = require('fs-extra');
const config = require('../lib/configstore');
const original = config.get();
const name = 'nav';
const path = `${process.cwd()}/${name}`





describe('testing all command line options', () => {
  let options = {
    componentType: 'class',
    placeInOwnDirectory: false,
    cssType: '.css',
    jsExtensions: '.jsx',
    createPropsValidation: true,
    includeTest: false
  };

  before(() => {
    config.set(options);
  });

  it('should create a component', (done) => {
    shellExec('rgc new nav')
      .then((success) => {
        let stderr = success.stderr;
        expect(stderr).to.equal('');
        done();
      })
  });

  it('should overwrite a component', (done) => {
    shellExec('rgc new nav -o')
      .then((success) => {
        let stderr = success.stderr;
        expect(stderr).to.equal('');
        done();
      });
  });

  it('should not overwrite a component', (done) => {
    shellExec('rgc new nav')
      .then((success) => {
        let stderr = success.stderr;

        expect(stderr).to.not.equal('');
        done();
      });
  });


  after((done) => {
    removeAllFiles(done);
  });
});




describe('testing adding css and tests when they\'re not set in the options', () => {
  let options = {
    componentType: 'class',
    placeInOwnDirectory: false,
    cssType: 'none',
    jsExtensions: '.jsx',
    createPropsValidation: true,
    includeTest: false
  };


  before(() => {
    config.set(options);
  });


  it('should create a css file', (done) => {
    shellExec(`rgc new ${name} -s .css`)
      .then(() => {
        expect(fs.existsSync(`${path}.css`)).to.equal(true);
        removeAllFiles(done);
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should create a test file', (done) => {
    shellExec(`rgc new ${name} -t`)
      .then(() => {
        expect(fs.existsSync(`${path}.test.js`)).to.equal(true);
        removeAllFiles(done);
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should create and place the files in a directory', (done) => {
    shellExec(`rgc new ${name} -s .css -t -d`)
      .then(() => {
        expect(fs.existsSync(`${path}`)).to.equal(true);
        removeFolder(done);
      })
      .catch((err) => {
        done(err);
      });
  });


  after((done) => {
    config.set(original);
    removeAllFiles(done);
  });
});






async function removeFolder(done) {
  try {
    await fs.remove(`${path}`);
    done();
  } catch (err) {

  }
}


/* removes all the files after testing is done */
async function removeAllFiles(done) {
  try {
    await removeJsxFile();
  } catch (e) {
    console.log(e);
  }

  try {
    await removeStyleFile();
  } catch (e) {
    console.log(e);
  }

  try {
    await removeTestFile();
  } catch (e) {
    console.log(e);
  }

  done();
}




/* The purpose of the following is to allow remove a specifc file in the tests above */

function removeJsxFile() {
  return fs.remove(`${path}.jsx`);
}

function removeStyleFile() {
  return fs.remove(`${path}.css`);;
}

function removeTestFile() {
  return fs.remove(`${path}.test.js`);
}