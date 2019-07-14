/* eslint-disable */
/* global it, describe, before, after */
const shellExec = require('shell-exec');
const expect = require('chai').expect;
const fs = require('fs-extra');
const config = require('../lib/config-store');
const original = config.get();
const name = 'nav';
const path = `${process.cwd()}/${name}`;
const { getCommittedFiles } = require('../lib/commit-files');

describe('Creating a component via the command line', () => {
  let options = {
    componentType: 'class',
    placeInOwnDirectory: false,
    cssType: '.css',
    jsExtensions: '.jsx',
    createPropsValidation: true,
    includeTest: false,
  };

  before(() => {
    config.set(options);
  });

  it('should create a component', done => {
    shellExec(`node index.js g ${name}`).then(success => {
      const { stderr } = success;
      expect(stderr).to.equal('');
      done();
    });
  });

  it('should overwrite a component', done => {
    shellExec(`node index.js g ${name} -o`).then(success => {
      const { stderr } = success;
      expect(stderr).to.equal('');
      done();
    });
  });

  it('should not overwrite a component', done => {
    shellExec(`node index.js g ${name}`).then(success => {
      const { stderr } = success;

      expect(stderr).to.not.equal('');
      removeAllFiles(done);
    });
  });

  it('should create a pure component', done => {
    shellExec(`node index.js g pureComponent -p`)
      .then(success => {
        fs.readFile(`${process.cwd()}/PureComponent.jsx`, 'utf8').then(data => {
          fs.readFile(`${process.cwd()}/tests/filesToCompare/PureComponent.jsx`, 'utf8')
            .then(data2 => {
              expect(data).to.equal(data2);
              done();
            })
            .catch(err => done(err));
        });
      })
      .catch(err => {
        done(err);
      });
  });

  after(done => {
    config.set(original);

    fs.remove(`${process.cwd()}/PureComponent.jsx`)
      .then(() => {
        fs.remove(`${process.cwd()}/PureComponent.css`)
          .then()
          .catch(err => done(err));
      })
      .catch(err => done(err));
    removeAllFiles(done);
  });
});

describe("testing adding css and tests when they're not set in the options", () => {
  let options = {
    componentType: 'class',
    placeInOwnDirectory: false,
    cssType: 'none',
    jsExtensions: '.jsx',
    createPropsValidation: true,
    includeTest: false,
  };

  before(() => {
    config.set(options);
  });

  it('should create a css file', done => {
    shellExec(`node index.js g ${name} -s .css`)
      .then(() => {
        expect(fs.existsSync(`${path}.css`)).to.equal(true);
        removeAllFiles(done);
      })
      .catch(err => {
        done(err);
      });
  });

  it('should create a test file', done => {
    shellExec(`node index.js g ${name} -t`)
      .then(() => {
        expect(fs.existsSync(`${path}.test.js`)).to.equal(true);
        removeAllFiles(done);
      })
      .catch(err => {
        done(err);
      });
  });

  it('should create and place the files in a directory', done => {
    shellExec(`node index.js g ${name} -s .css -t -d`)
      .then(() => {
        expect(fs.existsSync(`${path}`)).to.equal(true);
        expect(fs.existsSync(`${path}/${name}.jsx`)).to.equal(true);
        expect(fs.existsSync(`${path}/${name}.css`)).to.equal(true);
        expect(fs.existsSync(`${path}/${name}.test.js`)).to.equal(true);
        removeFolder(done);
      })
      .catch(err => {
        done(err);
      });
  });

  after(done => {
    config.set(original);
    removeAllFiles(done);
  });
});

describe('Testing command line commit tests', () => {
  const name = 'readme.md';

  it('should commit the readme.md to committed-files', done => {
    shellExec(`node index.js commit ${name}`).then(output => {
      expect(output.stderr).to.equal('');
      expect(fs.existsSync(`${process.cwd()}/committed-files/readme.md`)).to.equal(true);
      done();
    });
  });

  it('should remove all files from committed-files', done => {
    shellExec(`node index.js commit -p`).then(output => {
      expect(output.stderr).to.equal('');
      const files = getCommittedFiles();
      expect(files.length).to.equal(0);
      done();
    });
  });

  it('should commit multiple files', done => {
    Promise.all([shellExec(`node index.js commit readme.md`), shellExec(`node index.js commit package.json`)]).then(output => {
      const files = getCommittedFiles();
      expect(files.length).to.equal(2);
      done();
    });
  });

  it('should list all files', done => {
    shellExec(`node index.js commit -l`).then(output => {
      expect(output.stdout).to.equal('\nYour currently committed files are:\n1. package.json\n2. readme.md\n\n');
      done();
    });
  });

  it('should only remove the specified file', done => {
    shellExec(`node index.js commit package.json -r`).then(output => {
      const files = getCommittedFiles();
      expect(output.stderr).to.equal('');
      expect(files.length).to.equal(1);
      expect(fs.existsSync(`${process.cwd()}/committed-files/readme.md`)).to.equal(true);
      done();
    });
  });

  //finally remove all committed files
  after(done => {
    shellExec(`node index.js commit -p`).then(output => {
      done();
    });
  });
});

async function removeFolder(done) {
  try {
    await fs.remove(`${path}`);
  } catch (err) {}
  done();
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
  return fs.remove(`${path}.css`);
}

function removeTestFile() {
  return fs.remove(`${path}.test.js`);
}
