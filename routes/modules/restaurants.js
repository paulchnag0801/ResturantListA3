const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant') //載入restaurant model
const mongoose = require('mongoose')

router.get('/searches', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  if (keyword <= 0) {
    return res.redirect('/')
  }
  Restaurant.find()
    .lean()
    .then((restaurants) => {
      restaurants = restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(keyword) ||
          restaurant.category.includes(keyword)
      )
      if (restaurants.length > 0) {
        return res.render('index', {
          restaurants: restaurants,
          keyword: req.query.keyword.trim(),
        })
      } else {
        res.render('index', {
          keyword: req.query.keyword,
          no_result: `<h3> 沒有"${keyword}"的搜尋結果，請輸入正確的餐廳名稱</h3>`,
        })
      }
    })
    .catch((error) => console.error(error))
})

// sort restaurants
// sort
router.get('/sort', (req, res) => {

  const { select } = req.query

  Restaurant.find()
    .lean()
    .sort(select)
    .then((restaurants) => res.render('index', { restaurants, select }))
    .catch((error) => console.log(error))
})

// create route
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
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
  } = req.body
  if (
    !name ||
    !category ||
    !image ||
    !location ||
    !phone ||
    !google_map ||
    !rating ||
    !description
  ) {
    return res.redirect('/restaurants/new')
  }
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
    .then(() => res.redirect('/'))
    .catch((error) => console.error(error))
})

// read detail route
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('back')
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch((error) => console.error(error))
})

// Update edit route
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('back')
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => console.error(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('back')
  const editRestaurant = req.body
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => {
      restaurant.name = editRestaurant.name
      restaurant.name_en = editRestaurant.name_en
      restaurant.category = editRestaurant.category
      restaurant.image = editRestaurant.image
      restaurant.location = editRestaurant.location
      restaurant.phone = editRestaurant.phone
      restaurant.google_map = editRestaurant.google_map
      restaurant.rating = editRestaurant.rating
      restaurant.description = editRestaurant.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((error) => console.error(error))
})

// delete route
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

module.exports = router
