const babel = require('@babel/core');
const mkdirp = require('mkdirp');
const sass = require('sass');
const pug = require('pug');
const fs = require('fs').promises;
const path = require('path');
const { inlineSource } = require('inline-source');
const del = require('del');

const transpileJS = (files) => Promise.all(
  files.map((file) => babel.transformFileAsync(`src/${file}`, {
    presets: [
      ['@babel/preset-env'],
    ],
  })),
);

const writeJS = (files) => Promise.all(
  files.map((file) => fs.writeFile(`dist/.tmp/${path.basename(file.options.filename)}`, file.code)),
);

const runBabel = () => fs.readdir('src')
  .then((files) => transpileJS(files.filter((file) => path.extname(file).toLowerCase() === '.js')))
  .then((transpiledFiles) => writeJS(transpiledFiles));

const runPug = () => fs.writeFile(
  'dist/.tmp/index.html',
  pug.renderFile('src/index.pug', {
    filename: 'src/index.pug',
  }),
);

const runSass = () => fs.writeFile(
  'dist/.tmp/style.css',
  sass.renderSync({
    file: 'src/style.scss',
    sourceMap: false,
    outputStyle: 'compressed',
  }).css,
);

(async () => {
  try {
    mkdirp.sync('dist/.tmp');

    await Promise.all([
      runBabel(),
      runPug(),
      runSass(),
    ]);

    // inline-source
    const html = await inlineSource(path.resolve('dist/.tmp/index.html'), {
      compress: true,
      rootpath: path.resolve('dist/.tmp'),
    });
    await fs.writeFile('dist/index.html', html);
  } catch (err) {
    process.stdout.write(err);
  }
  await del(['dist/.tmp', 'dist/!index.html']);
})();
