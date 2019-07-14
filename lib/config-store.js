const Configstore = require('configstore');

module.exports = new Configstore('rgc-config', {
  componentType: 'class',
  cssType: 'none',
  jsExtensions: '.jsx',
  createPropsValidation: false,
  placeInOwnDirectory: false,
  includeTest: false,
});
