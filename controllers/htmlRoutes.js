const db = require('../models');

module.exports = (app) => {

    // Variable that will store text(html) to be displayed if there are no articles
    let defaultText;

    app.get('/', (req, res) => {
        // Set default text
        defaultText = 'There are no scraped articles!';
        // Find all articles and send them
        db.Articles.find({})
            .then(articles => {
                res.statusCode = 200;
                res.render('home', { pageTitle: 'Home', articles: articles, defaultText: defaultText });
            });
    });

    app.get('/saved', (req, res) => {
        // Set default text
        defaultText = 'There are no saved articles! Go <a href="/">home</a> to save some.';
        // Find all saved articles and send them
        db.SavedArticles.find({})
            .then(articles => {
                res.statusCode = 200;
                res.render('saved', { pageTitle: 'Saved', articles: articles, defaultText: defaultText });
            });
    });
};