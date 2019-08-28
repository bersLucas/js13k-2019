// eslint-disable-next-line import/no-extraneous-dependencies
const watch = require('node-watch');
const { exec } = require('child_process');

watch('./src', { recursive: true }, (evt, name) => {
  exec('yarn run build', () => {
    process.stdout(name);
  });
});
