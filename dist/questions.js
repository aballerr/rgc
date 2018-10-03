module.exports = [
  {
    type: 'confirm',
    name: 'shouldCreateFolder',
    message: 'Should we create a new folder with your component in it?'
  },
  {
    type: 'confirm',
    name: 'shouldCreatePropsValidation',
    message: 'Would you like to include props validation in all your new files by default?'
  },
  {
    type: 'list',
    name: 'jsExtensions',
    message: 'What kind of extensions do you prefer?',
    choices: ['.jsx', '.js']
  },
  {
    type: 'list',
    name: 'componentType',
    message: 'What do you want your default component type to be?',
    choices: ['class', 'pure']
  },
  {
    type: 'list',
    name: 'cssType',
    message: 'What kind of styling do you prefer?',
    choices: ['none', '.css', '.scss', '.sass', '.less']
  }
];
