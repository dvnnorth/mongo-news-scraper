const cheerio = require('cheerio');
const request = require('request-promise');
const db = require('../models');

module.exports = (app) => {

    app.get('/api/scrape', (req, res) => {

        // Clear the articles
        clearDocuments(res, res => {

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
                        .then(_ => {
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
        });
    });

    app.post('/api/save/:id', (req, res) => {

    });

    app.delete('/api/clear', (req, res) => {
        // If the helper function throws an error (delete unsuccessful) catch it and send it
        try {
            // Clear all documents
            clearDocuments(res, (res) => {
                // Success
                res.sendStatus(200);
            });
        }
        catch (err) {
            errorSend(err, res); // Send error if caught
        }
    });
};

// errorSend is a simple error handling function to DRY up code
let errorSend = (err, res) => {
    if (err) {
        res.statusCode = 500;
        res.send(err);
    }
};

// clearDocuments clears the database and then calls the callback function passing in the response parameter
let clearDocuments = (res, callback) => {
    db.Articles.deleteMany()
        .then(_ => {
            callback(res);
        })
        .catch(err => { throw err; });
};