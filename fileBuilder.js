// The purpose of this file is to centralize all the file writing into a single file
// This means less searching for any code you/I might be looking for

const fs = require('fs-extra');
const path = require('path');
const touch = require('touch');
const pureComponentTemplate = path.join(__dirname, './dist/templates/PureComponent.jsx');
const ComponentTemplate = path.join(__dirname, './dist/templates/Component.jsx');

module.exports = class fileBuilder {
  constructor(name, options, relativePath) {
    this.name = name;
    this.capitalizedName = name.replace(/^\w/, (c) => c.toUpperCase());
    this.options = options;
    this.reactFileName = `${relativePath}/${this.capitalizedName}${options.jsExtensions}`;
    this.cssFileName = `${relativePath}/${name}${options.cssType}`;
  }




  /* CREATES STYLING FILE */

  createStylingFile() {
    touch(this.cssFileName, '');
  }


  /* REACT FUNCTIONS */

  writeReactComponent() {
    if (this.options.cssType !== 'none')
      this.createStylingFile();
    this._writeClassImports();
  }

  _writeClassImports() {
    const endLine = ";\n";
    let imports = (this.options.componentType === "pure" ? "import React from 'react'" : "import React, { Component } from 'react'") + endLine;
    imports += this.options.shouldCreatePropsValidation ? "import PropTypes from 'prop-types'" + endLine : "";

    fs.outputFile(this.reactFileName, imports)
      .then(() => {
        this._writeClassBody();
      })
      .catch((err) => {
        throw err;
      });
  }


  _writeClassBody() {
    const template = this.options.componentType === 'pure' ? pureComponentTemplate : ComponentTemplate;

    fs.readFile(template, 'utf8')
      .then((response) => {
        const newFile = this._nameComponent(response, this.capitalizedName);
        fs.appendFile(this.reactFileName, newFile)
          .then(() => {
            if (this.options.shouldCreatePropsValidation) {
              this._writePropsValidation();
            } else {
              this._writeClassExport();
            }
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  _writePropsValidation() {
    const propsValidation = `${this.capitalizedName}.propTypes = {};\n\n`;
    fs.appendFile(this.reactFileName, propsValidation)
      .then(this._writeClassExport())
      .catch((err) => {
        throw err;
      });
  }

  _writeClassExport() {
    const classExport = `export default ${this.capitalizedName};\n`;
    fs.appendFile(this.reactFileName, classExport)
      .then()
      .catch((err) => {
        throw err;
      });
  }


  /* UTILITY FUNCTIONS */
  _nameComponent(text, name) {
    return text.replace(/\bREACT_TEMPLATE\b/g, name).replace(/\bREACT_TEMPLATE_CLASSNAME\b/, name.toLowerCase());
  }

};
