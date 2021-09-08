//The seed file will delete everything in our database then it runs the seeds for the database.

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection; // with this we don't have to reference mongoose.connection below.
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 300; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: '6116c4160149a532ec1423ad',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident ea, veritatis dicta soluta ullam pariatur fugit odit aliquam maxime earum, labore beatae distinctio optio, corporis quo eius quisquam. Ipsam, iusto.',
			price,
			geometry: {
					"type": "Point",
				"coordinates": [
					cities[random1000].longitude,
					cities[random1000].latitude,
				]
				},
			
				images: [
					{
						url: 'https://res.cloudinary.com/deeq7pxhe/image/upload/v1629337188/YelpCamp/ewzmntk0hl8mofft4q7x.jpg',
						filename: 'YelpCamp/ewzmntk0hl8mofft4q7x.jpg'
					},
					{
						url: 'https://res.cloudinary.com/deeq7pxhe/image/upload/v1629337751/YelpCamp/aqbqtsoaxyiwmgnxxufx.jpg',
						filename: 'YelpCamp/aqbqtsoaxyiwmgnxxufx.jpg'
					}
				]
			});
		
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close(); //this is how we close a database file.
});

// 'https://res.cloudinary.com/deeq7pxhe/image/upload/v1629250860/YelpCamp/bybgigc2rb5kq9f5yfc8.jpg'

