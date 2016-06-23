// Require all our dependencies
var express = require('express'),
    app = express(),
    Lob = require('lob')(process.env.LOBKEY),
    cloudinary = require('cloudinary'),
    formidable = require('formidable'),
    stripe = require('stripe')(process.env.STRIPESECRET)
    fs = require('fs')

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDKEY,
  api_secret: process.env.CLOUDSECRET
})

// Serve the public folder, statically
app.use(express.static('public'))

// Listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})

// Get a list of countries we can ship to
app.get("/countries", function(request, response) {
  Lob.countries.list(function (err, res) {
    response.send(res)
  })
})

// Create stripe charge
app.post("/payments", function(request, response) {
  var form = new formidable.IncomingForm()
  form.parse(request, function(err, fields, files) {
    stripe.charges.create({
      amount: 200,
      currency: "usd",
      source: fields.id,
      description: fields.email
    }, function(err, charge) {
      if(!err) {
        response.status(200).send(charge)
      } else {
        response.status(300).send(err)
      }
    })
  })
})

// Upload images to cloudinary and return the result
app.post('/upload', function(request, response){
  var form = new formidable.IncomingForm()
  form.parse(request, function(err, fields, files) {
    cloudinary.uploader.upload(files.image.path, function(result) { 
      response.send(result)
    })
  })
})

// Create a new postcard from our fields
app.post("/postcard", function (request, response) {
  var form = new formidable.IncomingForm()
  form.parse(request, function(err, fields, files) {
    Lob.postcards.create(
      fields, function (err, res) {
        if(!err) {
          response.send(res.body);
        } else {
          response.send(err)
        }
      }
    )
  })
})
