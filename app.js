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

// routes setting
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error))
})

// app.get('/search', (req, res) => {
//   const restaurantKeyword = restaurantList.results.filter(
//     (restaurantKeywords) => {
//       const keyword = req.query.keyword.trim().toLowerCase()
//       return (
//         restaurantKeywords.name.toLowerCase().includes(keyword) ||
//         restaurantKeywords.category.toLowerCase().includes(keyword)
//       )
//     }
//   )
//   if (restaurantKeyword.length > 0) {
//     res.render('index', {
//       restaurants: restaurantKeyword,
//       keyword: req.query.keyword.trim(),
//     })
//   } else {
//     res.render('index', {
//       keyword: req.query.keyword,
//       no_result: `<h3> 沒有"${req.query.keyword}"的搜尋結果，請輸入正確的餐廳名稱</h3>`,
//     })
//   }
// })

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

// app.get('/restaurants/:restaurant_id', (req, res) => {
//   const restaurant = restaurantList.results.find(
//     (restaurant) => restaurant.id.toString() === req.params.restaurant_id
//   )
//   res.render('show', { restaurant: restaurant })
// })

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
