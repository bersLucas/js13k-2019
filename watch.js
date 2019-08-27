const watch = require('node-watch');
const { exec } = require('child_process');

watch('./src', { recursive: true }, (evt, name) => {
  exec('yarn run build', (err, stdout, stderr) => {
    if (err) console.log(err, name);
    else { console.log('%s changed.', name); }
  });
});
