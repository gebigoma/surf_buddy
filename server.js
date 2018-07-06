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
  Comments = require('./models/Comment'),
  NodeGeocoder = require('node-geocoder'),
  moment = require('moment'),
  _ = require('underscore'),
  slugify = require('./helpers/slugify')

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

// Node-Geocoder Config
var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: googleApiKey, // for Mapquest, OpenCage, Google Premier
  formatter: null
};

const geocoder = NodeGeocoder(options);


// ejs configuration
app.set('view engine', 'ejs')

//middleware 
app.use(ejsLayouts)
app.use(cookieParser())
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static('public'))

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
    const counties = _.uniq(spots.map((s) => {
      return s.county_name
    })).map((c) => {
      return { name: c, slug: slugify(c) }
    })
    res.render('counties/index',  { counties })
  })
})

  app.get('/search', (req, res) => {
    res.render('spitcastTest')
  })

  app.get('/spots/search', (req, res) => {
    // geocoder.geocode(`${req.query.location}, CA`, function ( err, data ) {
    geocoder.geocode(`${req.query.location}, CA`, function ( err, data ) {  
      let { latitude, longitude  } = data[0];
      console.log(data)
      const apiUrl=`http://api.spitcast.com/api/spot-forecast/search?distance=20&longitude=${longitude}&latitude=${latitude}`
      apiClient({ method: 'get', url: apiUrl}).then((apiResponse) => {
        const spots = apiResponse.data
        console.log(spots.length)
        if (spots.length > 0) {
          res.render('spots/search', {spots: spots})
        } else {
          res.render('spots/error')
        }
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
      // res.render('spots/index', {allSpots: allSpots})
      console.log(allSpots[0].spot_name)
      res.redirect('/counties')
    })
  })

  app.get('/api/counties/:slug', (req, res) => {
    const apiUrl = `http://api.spitcast.com/api/county/spots/${req.params.slug}/`
    apiClient({ method: 'get', url: apiUrl}).then((apiResponse) => {
      const countySpots = apiResponse.data
      // res.render('counties/show', { countySpots })
      res.json(countySpots)
    })
  })

  app.get('/spots/:spot_id', (req, res) => {
    const apiUrl = `http://api.spitcast.com/api/spot/all`
    const forecastApiUrl = `http://api.spitcast.com/api/spot/forecast/${req.params.spot_id}`
    apiClient({ method: 'get', url: apiUrl}).then((apiResponse) => {
      const allSpots = apiResponse.data
      const spot = allSpots.find((s) => {
        return s.spot_id === Number(req.params.spot_id)
      })


      apiClient({ method: 'get', url: forecastApiUrl}).then((forecastApiResponse) => {
        const forecast = forecastApiResponse.data
        const hours = new Date().getHours()
        const amOrPm = hours > 11 ? "PM" : "AM"
        const formattedHours = ((hours + 11) % 12 + 1) + amOrPm
        const currentConditions = forecast.find((h) => {
          return h.hour === formattedHours
        })

        Comments.find({ spot_id: spot.spot_id }).populate('_by').sort({date: -1}).exec((err, comments) => {
          if (err) throw err;
          res.render('spots/show', { spot, comments, currentConditions, moment })
        })
      })
    })
  })

app.listen(PORT, (err) => {
  console.log(err || `Server running on ${PORT}.`)
})
