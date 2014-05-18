var mongoose = require('mongoose');

var presentationSchema = new mongoose.Schema({
        thumbnail: 	String,
        title: 		String,
        user: 		String,
        tags: 		[String],
        created_at: Date,
        updated_at: Date,
        contents: 	String,
        desc: 		String
});

module.exports = mongoose.model('Presentation', presentationSchema);