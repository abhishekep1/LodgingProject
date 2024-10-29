const Joi=require("joi");
const { model } = require("mongoose");
module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().allow('', null),  // Allows empty string or null
            filename: Joi.string().allow('', null),  // Optional filename field
        }).optional(),
        features: Joi.array().items(Joi.string()).optional(),
    }).required(),
});




module.exports.reviewSchema=Joi.object({
    review:Joi.object({
            rating:Joi.number().required().min(1).max(5),
            comment:Joi.string().required(),
        }).required(),
    });


