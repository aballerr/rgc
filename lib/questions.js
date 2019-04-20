module.exports = [
  {
    type: 'confirm',
    name: 'placeInOwnDirectory',
    message: 'Would you like a folder created to place your component in?',
  },
  {
    type: 'confirm',
    name: 'createPropsValidation',
    message: 'Would you like to include props validation in all your new files by default?',
  },
  {
    type: 'list',
    name: 'jsExtensions',
    message: 'What kind of extensions do you prefer?',
    choices: ['.jsx', '.js'],
  },
  {
    type: 'list',
    name: 'componentType',
    message: 'What do you want your default component type to be?',
    choices: ['class', 'pure'],
  },
  {
    type: 'list',
    name: 'cssType',
    message: 'What kind of styling do you prefer?',
    choices: ['none', 'styled-components', '.css', '.scss', '.sass', '.less'],
  },
  {
    type: 'confirm',
    name: 'includeTest',
    message: 'Should we include a test file for your component?',
  },
];
