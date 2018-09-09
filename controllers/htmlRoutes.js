const cheerio = require('cheerio');
const request = require('request');

module.exports = (app) => {

    app.get('/', (req, res) => {
        res.statusCode = 200;
        res.render('home');
    });
};