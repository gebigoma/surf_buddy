require('dotenv').config()

const 
  express = require('express'), 
  methodOverride = require('method-override'),
  app = express(),
  ejs = require('ejs'),
  ejsLayouts = require('express-ejs-layouts'),
  axios = require('axios'),
  apiClient = axios.create(),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  logger = require('morgan'), 
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  MongoDBStore = require('connect-mongodb-session')(session), 
  passport = require('passport'), 
  passportConfig = require('./config/passport.js'),
  usersRouter = require('./routers/Users'), 
  geocoder = require('geocoder')

const apiUrl = process.env.API_URL
const googleApiKey = process.env.GOOGLE_API_KEY

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


// root 
app.get('/', (req, res) => {
  res.render('index')
}) 
app.get('/about', (req, res) => {
  res.render('about')
}) 
app.get('/faq', (req, res) => {
  res.render('faq')
}) 
app.get('/contact', (req, res) => {
  res.render('contact')
})


// spitcast api
app.get('/spots', (req, res) => {
  console.log("Request received...")
  apiClient({ method: 'get', url: apiUrl}).then((apiResponse) => {
    const spots = apiResponse.data
    res.render('spots/index', {spots: spots})
  })
})

  app.get('/search', (req, res) => {
    res.render('spitcastTest')
  })

  app.get('/spots/search', (req, res) => {
    geocoder.geocode(req.query.location, function ( err, data ) {
      const coordinates = data.results[0].geometry.location
      const apiUrl=`http://api.spitcast.com/api/spot-forecast/search?distance=20&longitude=${coordinates.lng}&latitude=${coordinates.lat}`
      apiClient({ method: 'get', url: apiUrl}).then((apiResponse) => {
        const spots = apiResponse.data
        res.render('spots/search', {spots: spots})
        })
    });
  })

app.listen(PORT, (err) => {
  console.log(err || `Server running on ${PORT}.`)
})
