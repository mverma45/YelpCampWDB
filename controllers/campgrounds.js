const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
// the geocoder contains the two methods forward and reverse.

module.exports.index = async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
}
    
module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
	const geoData = await geocoder.forwardGeocode({
		query: req.body.campground.location, // this is saying we want location on the campground in the body 
		limit: 1 //this means we want one result.
	}).send() // this will send the reqest
		const campground = new Campground(req.body.campground);
		campground.geometry = geoData.body.features[0].geometry;
		campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
		campground.author = req.user._id;
		await campground.save();
		console.log(campground);
		req.flash('success', 'Successfully made a new campground!')
		res.redirect(`/campgrounds/${campground._id}`);
}
    
module.exports.showCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id).populate
		({
			path: 'reviews',
			populate: {
				path: 'author'
			}
		}).populate('author');
	// console.log(campground);
	//this is saying populate the campground, then populate the reviews, then populate the author for each review then seperatly populate the one author for the campground.
	if(!campground) {
	req.flash('error', 'Campground not found');
	res.redirect('/campgrounds');
}
	res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if(!campground) {
		req.flash('error', 'Campground not found');
		return res.redirect('/campgrounds');
	}
		res.render('campgrounds/edit', { campground });
}
    
module.exports.updateCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
	const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
	campground.images.push(...imgs);
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
		   await cloudinary.uploader.destroy(filename);
		}
	 await campground.updateOne({ $pull: { images: { filename: { $in: req.body.		  deleteImages } } } })
		// console.log(campground);
	}
	await campground.save();
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}