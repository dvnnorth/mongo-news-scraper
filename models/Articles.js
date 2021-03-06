const mongoose = require('mongoose');

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const ArticlesSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true,
        unique: true
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
        default: false,
        required: true
    },
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Articles with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Notes'
    }
});

// This creates our model from the above schema, using mongoose's model method
const Articles = mongoose.model('Articles', ArticlesSchema);

// Export the Articles model
module.exports = Articles;