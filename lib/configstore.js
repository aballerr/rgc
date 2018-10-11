const Configstore = require('configstore');

const configStore = new Configstore('rgc-config', {
  componentType: 'class',
  cssType: 'none',
  jsExtensions: '.jsx',
  createPropsValidation: false,
  placeInOwnDirectory: false,
  includeTest: false
});


module.exports = configStore;
