const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

require("dotenv").config();

//middlewares
app.use(bodyParser.json());

let multichain = require("multichain-node")({
    port: process.env.multichain_port,
    host: process.env.multichain_host,
    user: process.env.multichain_user,
    pass: process.env.multichain_pass
});


Stream = "data"

//Get All entries
app.get('/data', (req, res) => {
    retrieveAndDecryptData((result) => {
        res.send(JSON.stringify(result));
    });
});

const retrieveAndDecryptData = (callback) => {
    multichain.listStreamItems({ stream: Stream, count: 1000000 }, (err, result) => {
        if (err) {
            console.error("Error fetching stream items:", err);
            callback([]);
            return;
        }
        let resultReturn = [];
        for (let i = 0; i < result.length; i++) {
            const data = result[i].data;
            if (typeof data === 'string' && /^[0-9A-Fa-f]*$/.test(data)) {
                const decodedData = Buffer.from(data, 'hex').toString('utf8');
                resultReturn.push(JSON.parse(decodedData));
            } else {
                resultReturn.push(data.json);
            }
        }
        callback(resultReturn);
    });
};

//Get data by keys
app.get('/data/:key', (req, res) => {
    const key = req.params.key;
    retrieveDataByKey(key, (result) => {
        res.send(JSON.stringify(result));
    });
});

const retrieveDataByKey = (key, callback) => {
    multichain.listStreamKeyItems({ stream: Stream, key: key, count: 100 }, (err, result) => {
        if (err) {
            console.error("Error fetching stream items:", err);
            callback([]);
            return;
        }

        let resultReturn = [];
        for (let i = 0; i < result.length; i++) {
            const data = result[i].data;
            if (typeof data === 'string' && /^[0-9A-Fa-f]*$/.test(data)) {
                const decodedData = Buffer.from(data, 'hex').toString('utf8');
                resultReturn.push(JSON.parse(decodedData));
            } else {
                resultReturn.push(data.json);
            }
        }
        callback(resultReturn);
    });
};


//Post Data
app.post('/data', (req, res) => {
    let jsonData = req.body;
    let dataString = JSON.stringify(jsonData);
    let hexData = Buffer.from(dataString, 'utf8').toString('hex');

    multichain.publish({
        stream: Stream,
        key: req.body.key,
        data: hexData
    }, (err, response) => {
        if (err) {
            console.log(err);
            res.send("Cannot add Data")
        } else {
            res.send("Created Data");
        }
    })

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



