const Joi = require('joi');
// const sanitizeHtml = require('sanitize-html');

// const extension = (joi) => ({
// 	type: 'String',
// 	base: joi.string(),
// 	messages: {
// 		'string.escapeHTML': '{{#label}} must not include HTML!'
// 	},
// 	rules: {
// 		escapeHTML: {
// 			validate(value, helpers) {
// 				const clean = sanitizeHtml(value, {
// 					allowedTags: [],
// 					allowedAttributes: {},
// 				});
// 				if (clean !== value) return helpers.error('string.escapeHTML', { value })
// 				return clean;
// 			}
// 		}
// 	}
// });

// // //Sanitize HTML
// const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		price: Joi.number().required().min(0),
		location: Joi.string().required(),
		description: Joi.string().required()
	}).required(),
	deleteImages: Joi.array()
});
// // Joi documentation https://joi.dev/api/?v=17.4.1 API need to create the schema

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required().min(1).max(5),
		body: Joi.string().required()
	}).required()
});
