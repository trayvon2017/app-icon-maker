const fs = require('fs');
const sharp = require('sharp');
const contents = require('./Contents.json');
const sourceImage = './icon.png'
const outputDir = './outputs';
const tempArr = sourceImage.split('.');
const fileExt = tempArr[tempArr.length - 1];
var ProgressBar = require('progress');

function isExistDir(dir) {
  try {
    fs.statSync(dir);
    return true;
  } catch (err) {
    return false;
  }
}

function cleanDir(dir) {
  if (isExistDir(dir)) {
    console.log('Cleaning output directory...');
    fs.rmSync(dir, { recursive: true });
  }
  console.log('make output directory...');
  fs.mkdirSync(dir);
}


async function main() {
  cleanDir(outputDir);
  const bar = new ProgressBar('export images [:bar] :current/:total :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: contents.images.length
  });
  for (const element of contents.images) {
    const [width, height] = element.size.split('x');
    const scale = element.scale.split('x')[0];
    const filename = `icon-${width}@${element.scale}.${fileExt}`;
    element.filename = filename;
    const result = await sharp(sourceImage)
      .resize(scale * width, scale * height)
      .toFile(`${outputDir}/${filename}`);
    if (result) {
      bar.tick();
    }
  }
  
  fs.writeFileSync(`${outputDir}/Contents.json`, JSON.stringify(contents, null, 2));
}

main();