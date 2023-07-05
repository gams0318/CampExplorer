const mongoose = require('mongoose');
const Review = require('./review')
//const { campgroundSchema } = require('../schemas');
//mongoose.connect('mongodb://127.0.0.1:27017/test');
const User = require('./users')
const ImageSchema = new mongoose.Schema({
    url: String, filename: String

})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300')
})
const campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: [ImageSchema],
    description: String,
    location: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
})
campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})
const Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;