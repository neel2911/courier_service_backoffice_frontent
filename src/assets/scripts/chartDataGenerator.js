const fs = require('fs');

let rawdata = fs.readFileSync(`../jsons/anomaly-detection-dasbhoard/chart_data_study.json`);;
let chartData = JSON.parse(rawdata);

chartData.data.domainDetails.map(
    (item,ind) => {
        chartData.data.domainDetails[ind].
    }
)


let data = JSON.stringify(chartData)
fs.writeFileSync(`../jsons/anomaly-detection-dasbhoard/chart_data_study.json`,data)