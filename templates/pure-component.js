const pureReactComponentTemplate = (name, options) => {
  let capitalizedName = name.replace(/^\w/, c => c.toUpperCase());

  let template = `import React from 'react';\n`;
  if (options.createPropsValidation) template += `import PropTypes from 'prop-types';\n`;
  if (options.cssType !== 'none')
    template +=
      options.cssType === 'styled-components'
        ? `import styled from 'styled-components';\n`
        : `import './${capitalizedName}${options.cssType}';\n`;

  template += `
const ${capitalizedName} = ({ children }) => <div className="${name}">{children}</div>;
\n`;

  if (options.createPropsValidation) template += `${capitalizedName}.propTypes = {};\n`;

  template += `export default ${capitalizedName};\n`;

  return template;
};

module.exports = pureReactComponentTemplate;
