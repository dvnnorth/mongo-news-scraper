const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const apiRoutes = require('./controllers/apiRoutes');
const htmlRoutes = require('./controllers/htmlRoutes');

// Create express app
const app = express();

// Define listening port
const PORT = process.env.PORT || 8000;

// Setup middleware and render engine
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Setup routes
apiRoutes(app);
htmlRoutes(app);

// If deployed, get URI from environment, otherwise use localhost
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Connect to database and setup listener
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, () => {
    app.listen(PORT /* , () => console.log(`Application running on port ${PORT}`) */);
});