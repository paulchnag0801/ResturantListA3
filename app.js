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
  const restaurantKeyword = restaurantList.results.filter((keyword) => {
    return keyword.name.toLowerCase().includes(req.query.keyword.toLowerCase())
  })
  res.render('index', {
    restaurants: restaurantKeyword,
    keyword: req.query.keyword,
  })
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
