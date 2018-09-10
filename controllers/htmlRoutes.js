const db = require('../models');

module.exports = (app) => {

    // Variable that will store text(html) to be displayed if there are no articles
    let defaultText;

    app.get('/', (req, res) => {
        // Set default text
        defaultText = 'There are no scraped articles!';
        // Find all articles and send them
        findAllAndSend(res, defaultText);
    });

    app.get('/saved', (req, res) => {
        // Set default text
        defaultText = 'There are no saved articles! Go <a href="/">home</a> to save some.';
        // Find all saved articles and send them
        findAllAndSend(res, defaultText, { saved: true });
    });
};

let findAllAndSend = (res, defaultText, constraints) => {
    db.Articles.find(constraints ? constraints : {})
        .then(articles => {
            res.statusCode = 200;
            res.render('home', { pageTitle: 'Saved', articles: articles, defaultText: defaultText });
        });
}