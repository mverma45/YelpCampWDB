const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema; //this is a shortcut

const ImageSchema = new Schema({
		url: String,
		filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
	title: String,
	images: [ImageSchema],
	geometry: {
    	type: {
      		type: String, // Don't do `{ geometry: { type: String } }`
      		enum: ['Point'], // 'geometry.type' must be 'Point'
      		required: true
    	},
		coordinates: {
			type: [Number],
			required: true
		}
    },
  
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
	return `
	<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
	<p>${this.description.substring(0, 20)}...</p>`//this truncates the string to 20 characters and also adds the ...
});

// Deleting reviews and campground
CampgroundSchema.post('`findOneAndDelete', async function(doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		});
	}
});

module.exports = mongoose.model('Campground', CampgroundSchema);
