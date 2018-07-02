require('dotenv').config()

const 
  express = require('express'), 
  methodOverride = require('method-override'),
  app = express(),
  ejs = require('ejs'),
  ejsLayouts = require('express-ejs-layouts'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  logger = require('morgan'), 
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  MongoDBStore = require('connect-mongodb-session')(session), 
  passport = require('passport'), 
  passportConfig = require('./config/passport.js'),
  usersRouter = require('./routers/Users')

  PORT = process.env.PORT,
  mongoConnectionString = process.env.MONGODB_URI

mongoose.connect(process.env.MONGODB_URI, (err) => {
  console.log(err || "Connected to DB!")
});

// mongoose connection
const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
})

// ejs configuration
app.set('view engine', 'ejs')

//middleware 
app.use(ejsLayouts)
app.use(cookieParser())
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


//sessions 
app.use(session({
  secret: "Poop",
  cookie: {maxAge: 60000000 },
  resave: true,
  saveUninitialized: false,
  store: store
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  app.locals.currentUser = req.user 
  app.locals.isLoggedIn = !!req.user
  next()
})

// router
app.use('/users', usersRouter)

// 
app.get('/', (req, res) => {
  res.render('index')
})

app.listen(PORT, (err) => {
  console.log(err || `Server running on ${PORT}.`)
})
