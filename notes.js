/* form might look like:
  <form method="get" action="/search">
    <input type="text" name="location">
    <button>Search</button>
  </form>
*/

// localhost:3000/search?location=santa monica

// http://api.spitcast.com/api/spot-forecast/search?longitude=-118.4911912&latitude=34.0194543&distance=10

/*
  app.get('/search', (req, res) => {
    // 1. use the geocoding npm package (geocoder):
    geocoder.geocode(req.query.location, function ( err, data ) {
      // 2. using the data you get back (lat and lng), make an api call to the search endpoint, plugging in the lat / lng:
      apiClient({ method: 'get', url: apiUrl}).then((apiResponse) => {
        res.json(apiResponse.data)
      })
    });
  })
*/
