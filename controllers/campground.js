const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary/index')


module.exports.index = async (req, res) => {

    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })

}
module.exports.renderNew = (req, res) => {

    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {

    const camp = req.body;
    const campground = new Campground(camp);
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save()
    console.log(campground)
    req.flash('success', 'Successfully created new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {

    const { id } = req.params;

    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    // console.log(campground)
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    //console.log(campground)
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const camp = req.body
    console.log(camp)
    const campground = await Campground.findByIdAndUpdate(id, { ...camp })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.image.push(...imgs)
    await campground.save()
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) { cloudinary.uploader.destroy(filename) }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } })
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect(`/campgrounds`)
}

//module.exports.