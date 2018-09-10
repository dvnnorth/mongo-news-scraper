const db = require('../models');

module.exports = (app) => {

    app.get('/', (req, res) => {
        db.Articles.find({})
            .then(articles => {
                console.log(articles);
                res.statusCode = 200;
                res.render('home', { articles: articles });
            });
    });
};