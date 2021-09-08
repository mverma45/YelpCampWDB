const mongoose = require('mongoose');
const Schema = mongoose.Schema; //this is a shortcut

const reviewSchema = new Schema({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Review', reviewSchema);
