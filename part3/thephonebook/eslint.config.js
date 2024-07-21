import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    'rules': {
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 0
    }
  }, {
    "ignores": [
      "node_modules/",
      "build/",
      "dist/",
    ],
  }
];