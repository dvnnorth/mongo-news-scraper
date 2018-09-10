const cheerio = require('cheerio');
const request = require('request-promise');
const db = require('../models');

module.exports = (app) => {

    app.get('/api/scrape', (req, res) => {

        // Clear the unsaved articles
        db.Articles.deleteMany()
            .then(() => {
                // Get the html from nytimes
                request.get('https://www.nytimes.com')

                    .then(html => {

                        // Load $ cheerio handler
                        const $ = cheerio.load(html);

                        // articles will hold all of the article objects to be inserted into the database
                        let articles = [];

                        $('article').each(function () {

                            // Save an empty result object
                            let result = {};

                            // Get the section to exclude the Breifings
                            let section = $(this).closest($('section')).attr('data-block-tracking-id');

                            if (section !== 'Briefings') {

                                // Add the text and href of every link, and save them as properties of the result object
                                result.title = $(this)
                                    .find('h2')
                                    .text();
                                // Store the section for display later
                                result.section = section;
                                // Store the link to the article
                                result.link = `https://www.nytimes.com${$(this)
                                    .find('a')
                                    .attr('href')}`;
                                // Store a null note for now
                                result.note = null;
                            }

                            // Only push the article to results if the required fields exist
                            if (result.title && result.section && result.link) {
                                articles.push(result);
                            }
                        });

                        // Bulk insert all of the article objects
                        db.Articles.insertMany(articles)
                            .then(() => {
                                // Get every article
                                db.Articles.find({})
                                    .then(articles => {
                                        // Send the articles
                                        res.statusCode = 200;
                                        res.send(articles);
                                    })
                                    .catch(err => errorSend(err, res)); // Send error if caught
                            })
                            .catch(err => errorSend(err, res)); // Send error if caught
                    });
            })
            .catch(err => errorSend(err, res));
    });

    // Modal builder
    app.post('/api/modal', (req, res) => {
        res.render('modal', { content: req.body });
    });

    // Save an article
    app.put('/api/save/:id', (req, res) => {
        db.Articles.findById(req.params.id)
            .then(article => {
                article.saved = true;
                let { title, section, link, note } = article;
                let newArticle = {
                    title: title,
                    section: section,
                    link: link,
                    node: note
                };
                article.save(() => {
                    db.SavedArticles.find({ title: article.title })
                        .then(data => {
                            if (data.length === 0) {
                                db.SavedArticles.create(newArticle)
                                    .then((savedArticle) => {
                                        res.statusCode = 200;
                                        res.send(savedArticle);
                                    })
                                    .catch(err => errorSend(err, res));
                            }
                            else {
                                res.sendStatus(204);
                            }
                        });
                });
            })
            .catch(err => errorSend(err, res));
    });

    // Unsave an article
    app.delete('/api/save/:id', (req, res) => {
        db.SavedArticles.findOneAndRemove({ _id: req.params.id })
            .then((removed) => {
                db.Articles.findOne({ title: removed.title })
                    .then((article) => {
                        article.saved = false;
                        article.save(() => {
                            res.sendStatus = 200;
                        });
                    })
                    .catch(err => errorSend(err, res));
            })
            .catch(err => errorSend(err, res));
    });

    // Delete all articles
    app.delete('/api/clear', (req, res) => {
        db.Articles.deleteMany({})
            .then(() => {
                db.SavedArticles.deleteMany({})
                    .then(() => {
                        res.sendStatus(200);
                    })
                    .catch(err => errorSend(err, res));
            })
            .catch(err => errorSend(err, res));
    });
};

// errorSend is a simple error handling function to DRY up code
let errorSend = (err, res) => {
    if (err) {
        res.statusCode = 500;
        res.send(err);
    }
};