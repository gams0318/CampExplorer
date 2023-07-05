
const mongoose = require('mongoose');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')
mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("Database connected")
})
const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 20) + 10;
        const rand1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '649e97f39afece78e239d6f4',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                    url: 'https://res.cloudinary.com/dwazmjaph/image/upload/v1688197876/YelpCamp/l9i1k9bpnjvyrpuynxtf.jpg',
                    filename: 'YelpCamp/l9i1k9bpnjvyrpuynxtf',

                },
                {
                    url: 'https://res.cloudinary.com/dwazmjaph/image/upload/v1688197877/YelpCamp/zno09ycjauoejka7axpq.jpg',
                    filename: 'YelpCamp/zno09ycjauoejka7axpq',

                }
            ],

            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, rerum. Assumenda tempora vero aspernatur accusantium culpa dolorem quasi sunt aperiam voluptate! Eum odit quis iste, voluptatibus fuga perferendis sint labore.",
            price: price

        })
        await camp.save()
    }
}
seedDB().then(() => mongoose.connection.close())
