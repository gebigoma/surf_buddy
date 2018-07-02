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
  passportConfig = require('./config/passport.js')

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

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// router

app.listen(PORT, (err) => {
  console.log(err || `Server running on ${PORT}.`)
})
