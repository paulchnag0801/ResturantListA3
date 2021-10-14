// require packages used in the project
const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')

// 引用路由器
const routes = require('./routes')

const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()
const port = 3000

// require express-handlebars here
const exphbs = require('express-handlebars')

// setting template engine
// handlebars
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: {
      sort: function (select, selectValue) {
        return select === selectValue ? 'selected' : ''
      }
    }
 }))
app.set('view engine', 'handlebars') //設定的 view engine 是 handlebars

app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true,
  })
)

// setting static files
app.use(express.static('public')) //告訴 Express 靜態檔案是放在名為 public 的資料夾中
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use(routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
