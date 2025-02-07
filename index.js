const fs = require('fs');
const sharp = require('sharp');
const iosConfig = require('./ios.json');
const androidConfig = require('./android.json')
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
  fs.mkdirSync(`${dir}/ios`);
  fs.mkdirSync(`${dir}/android`);
}


async function main() {
  cleanDir(outputDir);
  const iosBar = new ProgressBar('export ios icons [:bar] :current/:total :percent :elapseds', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: iosConfig.images.length
  });
  for (const element of iosConfig.images) {
    const [width, height] = element.size.split('x');
    const scale = element.scale.split('x')[0];
    const filename = `icon-${width}${scale > 1 ? '@' + element.scale : ''}.${fileExt}`;
    element.filename = filename;
    const result = await sharp(sourceImage)
      .resize(scale * width, scale * height)
      .toFile(`${outputDir}/ios/${filename}`);
    if (result) {
      iosBar.tick();
    }
  }
  fs.writeFileSync(`${outputDir}/ios/Contents.json`, JSON.stringify(iosConfig, null, 2));
  console.log('iOS icons exported successfully');

  const androidBar = new ProgressBar('export ios icons [:bar] :current/:total :percent :elapseds', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: androidConfig.images.length
  });
  for (const element of androidConfig.images) {
    const [width, height] = element.size.split('x');
    const filename = `${element.filename}.${fileExt}`;
    const dir = `${outputDir}/android/${element.dir}`;
    if (!isExistDir(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const result = await sharp(sourceImage)
      .resize(+width, +height)
      .toFile(`${dir}/${filename}`);
    if (result) {
      androidBar.tick();
    }
  }
  console.log('Android icons exported successfully');
}

main();