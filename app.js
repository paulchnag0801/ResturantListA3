// require packages used in the project
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const Restaurant = require('./models/restaurant') //載入restaurant model
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/restaurant-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// require express-handlebars here
const exphbs = require('express-handlebars')
// const restaurantList = require('./seeds/restaurant.json')
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // 定義要使用的樣板引擎
app.set('view engine', 'handlebars') //設定的 view engine 是 handlebars

// setting static files
app.use(express.static('public')) //告訴 Express 靜態檔案是放在名為 public 的資料夾中
app.use(express.urlencoded({ extended: true }))
// routes setting
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error))
})

app.get('/restaurants/searches', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  Restaurant.find()
    .lean()
    .then((restaurants) => {
      if (restaurants >= 0) {
        restaurants = restaurants.filter(
          (restaurant) =>
            restaurant.name.toLowerCase().includes(keyword) ||
            restaurant.category.includes(keyword)
        )
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

// create route
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
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
  })
    .then(() => res.redirect('/'))
    .catch((error) => console.error(error))
})

// read detail route
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch((error) => console.error(error))
})

// Update edit route
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => console.error(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  const editRestaurant = req.body
  return Restaurant.findById(id)
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
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((error) => console.error(error))
})

// delete route
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
