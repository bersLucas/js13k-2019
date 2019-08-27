const watch = require('node-watch');
const { exec } = require('child_process');

watch('./src', { recursive: true }, (evt, name) => {
  exec('yarn run build', (err, stdout, stderr) => {
    console.log(err, stdout, stderr);
  });
});
