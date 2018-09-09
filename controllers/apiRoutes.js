const cheerio = require('cheerio');
const request = require('request');

module.exports = (app) => {

    app.get('/api/scrape', (req, res) => {
        res.statusCode = 200;
        res.send('Success!');
    });
};