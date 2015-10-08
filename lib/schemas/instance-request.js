/* jshint node: true */
module.exports = {
  title: 'InstanceRequest',
  type: 'object',
	properties: {
		namespace: {
			type: 'string',
      pattern: '[A-Za-z0-9:\-]+'
		}
	},
  // Propriétés obligatoires
	required: ['namespace']
};
