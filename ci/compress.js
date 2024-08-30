const fs = require('fs');
const archiver = require('archiver');

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

const version = packageJson.version;

function compressToZip(name, withSrc = false) {
  const output = fs.createWriteStream(name);
  const archive = archiver('zip');

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function (err) {
    throw err;
  });
  archive.pipe(output);

  archive.directory('dist/js/', 'js');
  archive.directory('dist/css/', 'css');
  if (withSrc) {
    archive.directory('src/');
    archive.directory('sass/');
  }
  archive.file('LICENSE');
  archive.file('README.md');

  archive.finalize();
}

compressToZip('dist/materialize-v' + version + '.zip');
compressToZip('dist/materialize-src-v' + version + '.zip', true);
