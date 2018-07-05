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
  commentsRouter = require('./routers/Comments'),   
  geocoder = require('geocoder')


const apiUrl = process.env.API_URL 
const apiSpotUrl = process.env.API_SPOT_URL
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
app.use('/', commentsRouter)


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
app.get('/counties', (req, res) => {
  console.log("Request received...")
  apiClient({ method: 'get', url: apiUrl}).then((apiResponse) => {
    const spots = apiResponse.data
    res.render('counties/index', {spots: spots})
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

  app.get('/spots', (req, res) => {
    console.log('hello')
    const apiUrl = `http://api.spitcast.com/api/spot/all`
    console.log('api!')
    apiClient({ method: 'get', url: apiUrl }).then((apiResponse) => {
      const allSpots = apiResponse.data
      console.log('apiclient working!')
      res.render('spots/index', {allSpots: allSpots})
      console.log(allSpots[0].spot_name)
    })
  })

  app.get('/spots/:spot_id', (req, res) => { 
    const apiUrl = `http://api.spitcast.com/api/spot/all`
    apiClient({ method: 'get', url: apiUrl}).then((apiResponse) => {
      const allSpots = apiResponse.data
      const spot = allSpots.find((s) => {
        return s.spot_id === Number(req.params.spot_id)
      })
      Comments.find({ spot_id: spot.spot_id }).populate('_by').exec((err, comments) => {
        if (err) throw err;
        res.render('spots/show', { spot, comments })
      })
    })
  })

app.listen(PORT, (err) => {
  console.log(err || `Server running on ${PORT}.`)
})
