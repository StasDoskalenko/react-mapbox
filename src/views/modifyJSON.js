const fs = require('fs');
const fileName = './zones.json';
const file = require(fileName);

console.log(file.features.length);

for (let i=0; i < file.features.length; i++) {
  const feature = file.features[i];
  feature.id = i;
}

fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
  if (err) return console.log(err);
  console.log('writing to ' + fileName);
});