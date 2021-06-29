// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

// require express-handlebars here
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // 定義要使用的樣板引擎
app.set('view engine', 'handlebars') //設定的 view engine 是 handlebars

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const restaurantKeyword = restaurantList.results.filter(
    (restaurantKeywords) => {
      const keyword = req.query.keyword.trim().toLowerCase()
      return (
        restaurantKeywords.name.toLowerCase().includes(keyword) ||
        restaurantKeywords.category.toLowerCase().includes(keyword)
      )
    }
  )
  if (restaurantKeyword.length > 0) {
    res.render('index', {
      restaurants: restaurantKeyword,
      keyword: req.query.keyword.trim(),
    })
  } else {
    res.render('index', {
      keyword: req.query.keyword,
      no_result: `<h3> 沒有"${req.query.keyword}"的搜尋結果，請輸入正確的餐廳名稱</h3>`,
    })
  }
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  )
  res.render('show', { restaurant: restaurant })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
