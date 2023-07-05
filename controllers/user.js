const Campground = require('../models/campground')
const Review = require('../models/review')
const User = require('../models/users')


module.exports.register = (req, res) => {
    res.render('users/register')
}

module.exports.registerNewUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, err => {
            if (err)
                return next(err);
            else {
                req.flash('success', 'Welcome to YelpCamp')
                res.redirect('/campgrounds')
            }
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}

module.exports.login = (req, res) => {
    res.render('users/login')

}

module.exports.userLogin = (req, res) => {
    req.flash('success', `Welcome back `)
    // res.redirect('/campgrounds')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (e) {
        if (e)
            return next(e)
        req.flash('success', 'BYE!')
        res.redirect('/campgrounds')
    })

}