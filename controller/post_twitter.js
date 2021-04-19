const https = require('https');

module.exports = function request(options) {
    return new Promise((resolve, reject) =>{
        const req = https.request(options, (res) =>{
            res.setEncoding('utf-8');
            let data = "";
            res.on('data', (chunk) =>{
                data += chunk;
            });
            res.on('end', () =>{
                resolve(JSON.parse(data));
            })
        })
        req.on('error', (err) =>{
            reject(err)
        });
        req.end()
    })
}