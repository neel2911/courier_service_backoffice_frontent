const fs = require('fs');

let args  = process.argv.slice(2)
console.log(args);
let rawdata = fs.readFileSync(`../jsons/anomaly-detection-dasbhoard/${args[0]}`);;
let tileJSON = JSON.parse(rawdata);

console.log(tileJSON);
tileJSON.data.completed.count = Math.floor(Math.random()*200)
tileJSON.data.inProgress.count = Math.floor(Math.random()*200)
tileJSON.data.notStarted.count = Math.floor(Math.random()*200);

tileJSON.data.identified.count = tileJSON.data.completed.count + tileJSON.data.inProgress.count + tileJSON.data.notStarted.count;

let data = JSON.stringify(tileJSON)
fs.writeFileSync(`../jsons/anomaly-detection-dasbhoard/${args[0]}`,data)