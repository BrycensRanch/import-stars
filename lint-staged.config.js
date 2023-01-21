module.exports = {
  '*.{js,ts}': ['eslint --fix', 'eslint'],
  '**/*.ts': () => 'npm run check-types',
  '*.json': ['prettier --write'],
};
