const db = require('../models');

module.exports = (app) => {

    // Variable that will store text(html) to be displayed if there are no articles
    let defaultText;

    app.get('/', (req, res) => {
        // Set default text
        defaultText = 'There are no scraped articles!';
        // Find all articles and send them
        findAllAndSend(res, defaultText, 'Home');
    });

    app.get('/saved', (req, res) => {
        // Set default text
        defaultText = 'There are no saved articles! Go <a href="/">home</a> to save some.';
        // Find all saved articles and send them
        findAllAndSend(res, defaultText, 'Saved', { saved: true });
    });
};

let findAllAndSend = (res, defaultText, pageTitle, constraints) => {
    db.Articles.find(constraints ? constraints : {})
        .then(articles => {
            res.statusCode = 200;
            res.render('home', { pageTitle: pageTitle, articles: articles, defaultText: defaultText });
        });
}