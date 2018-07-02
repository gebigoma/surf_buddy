require('dotenv').config()

const 
  express = require('express'), 
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

mongoose.connect(process.env.MONGODB_URI, (err) => {
  console.log(err || "Connected to DB!")
})

//middleware 
app.use(cookieParser())
app.use(logger('dev'))


// environment port
const 
  PORT = process.env.PORT,
  mongoConnectionString = process.env.MONGODB_URI

// mongoose connection
const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
})
//sessions 
app.use(session({
  secret: "Shhh",
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

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// router
app.get('/', (req, res) => {
  res.render('index')
})

app.use('/api/users', usersRouter)

app.listen(PORT, (err) => {
  console.log(err || `Server running on ${PORT}.`)
})
