/* jshint node: true */
module.exports = {
  title: 'AppTemplate',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '[a-z0-9:]+'
    },
    image: {
      type: 'string'
    }
  },
  // Propriétés obligatoires
  required: ['name', 'image']
};
