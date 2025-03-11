import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        module: 'readonly',
        require: 'readonly',
        process: 'readonly'
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      eqeqeq: 'off',
      'no-unused-vars': 'error',
      semi: ['error', 'never'],
      indent: ['error', 2],
    },
  },
]
