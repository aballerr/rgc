const classReactComponentTemplate = (name, options) => {
  let capitalizedName = name.replace(/^\w/, (c) => c.toUpperCase());

  let template =  `import React, { Component } from 'react';\n`;
  if(options.createPropsValidation)
    template += `import PropTypes from 'prop-types';\n`;
  if(options.cssType !== 'none')
    template += `import './${capitalizedName}${options.cssType}';\n`;

  template +=
`
class ${capitalizedName} extends Component {
  render() {
    return (
      <div className="${name}">
        {this.props.children}
      </div>
    );
  }
}
\n`;

  if(options.createPropsValidation)
      template += `${capitalizedName}.propTypes = {};\n`;

  template += `export default ${capitalizedName};\n`;

  return template;
};

module.exports = classReactComponentTemplate;
