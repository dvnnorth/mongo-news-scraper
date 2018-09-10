const mongoose = require('mongoose');

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const SavedArticlesSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true
    },
    // 'section' is required and of type String
    section: {
        type: String,
        required: true
    },
    // `link` is required and of type String
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: true,
        required: true
    },
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the SavedArticles with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Notes'
    }
});

// This creates our model from the above schema, using mongoose's model method
const SavedArticles = mongoose.model('SavedArticles', SavedArticlesSchema);

// Export the SavedArticles model
module.exports = SavedArticles;