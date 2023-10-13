module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: ['standard', 'plugin:prettier/recommended'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'error',
	},
};
