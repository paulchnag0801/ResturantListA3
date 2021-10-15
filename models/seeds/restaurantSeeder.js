const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const data = require('./restaurant.json')
const restaurantList = data.results

const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')

const SEED_USER = [
  {
    name: 'User1',
    email: 'user1@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(0, 4),
  },
  {
    name: 'User2',
    email: 'user2@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(4, 8),
  },
]

db.once('open', () => {
  return Promise.all(
    SEED_USER.map(async (SEED_USER) => {
      const { name, email, password, restaurants } = SEED_USER
      await bcrypt
        .genSalt(10)
        .then((salt) => {
          return bcrypt.hash(password, salt)
        })
        .then((hash) => {
          return User.create({ name, email, password: hash })
        })
        .then((user) => {
          return Promise.all(
            restaurants.map((restaurant) => {
              const {
                name,
                name_en,
                category,
                image,
                location,
                phone,
                google_map,
                rating,
                description,
              } = restaurant
              const userId = user._id

              return Restaurant.create({
                name,
                name_en,
                category,
                image,
                location,
                phone,
                google_map,
                rating,
                description,
                userId,
              })
            })
          )
        })
    })
  ).then(() => {
    console.log('seeder done!')
    process.exit()
  })
})

// db.once('open', () => {
//   console.log('mongodb connected!')
//   restaurantList.forEach((restaurant) =>
//     Restaurant.create({
//       id: restaurant.id,
//       name: restaurant.name,
//       name_en: restaurant.name_en,
//       category: restaurant.category,
//       image: restaurant.image,
//       location: restaurant.location,
//       phone: restaurant.phone,
//       google_map: restaurant.google_map,
//       rating: restaurant.rating,
//       description: restaurant.description,
//     })
//   )
//   console.log('finish!')
// })
