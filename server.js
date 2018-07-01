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
  PORT = 3000

// environment port

// mongoose connection

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// router

app.listen(PORT, (err) => {
  console.log(err || `Server running on ${PORT}.`)
})
