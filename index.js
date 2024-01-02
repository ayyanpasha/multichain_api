const express = require('express');
const app = express();
const port = 3000;
require("dotenv").config();

let multichain = require("multichain-node")({
    port: process.env.multichain_port,
    host: process.env.multichain_host,
    user: process.env.multichain_user,
    pass: process.env.multichain_pass
});


Stream = "data"

app.get('/getData', (req, res) => {
    multichain.listStreamItems({ stream: Stream, count: 5 }, (err, result) => {
        if (err) {
            res.send("No Data")
        } else {
            var Data = "";
            for (var i = 0; i < result.length - 1; i++) {
                Data += JSON.stringify(result[i].data.json) + "<br>";  //Get Data from each entries
            }
            res.send(Data);
        }
    })
});


app.get('/addData', (req, res) => {
    let jsonData = { name: "testValue", city: "Mumbai" };
    let hexData = new Buffer(JSON.stringify(jsonData)).toString("hex");

    multichain.publish({
        stream: Stream,
        key: "key2",
        data: hexData
    }, (err, response) => {
        if (err) {
            res.send("Cannot add Data")
        } else {
            res.send("Created Data");
        }
    })

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



