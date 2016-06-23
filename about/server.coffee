express = require 'express'
app = express()
coffeeMiddleware = require 'coffee-middleware'
engines = require 'consolidate'
bodyParser = require 'body-parser'
stylish = require 'stylish'
autoprefixer = require 'autoprefixer-stylus'
rq = require 'request-promise'

PORT = process.env.PORT

app.use(express.static('public'))

# sets up jade
app.set('view engine', 'jade')
app.engine('jade', engines.jade)

# sets up coffee-script support
app.use coffeeMiddleware
  bare: true
  src: "public"
require('coffee-script/register')

app.use bodyParser.urlencoded
  extended: false
app.use bodyParser.json()
app.use bodyParser.text()

# sets up stylus and autoprefixer

app.use stylish
  src: __dirname + '/public'
  setup: (renderer) ->
    renderer.use autoprefixer()
  watchCallback: (error, filename) ->
    if error
      console.log error
    else
      console.log "#{filename} compiled to css"

app.listen PORT, ->
  console.log "Your app is running on #{PORT}"

getInvitedUserToken = (request) ->
  if request.query.token
    token = "?token=#{request.query.token}"
  else
    token = ""

getEmail = (request) ->
  if request.query.email
    email = request.query.email
  else
    email = ''

displayIndex = (request, response) ->
  token = getInvitedUserToken(request)
  email = getEmail(request) # if request.query.email then request.query.email else ""
  response.render 'index',
    title: 'HyperDev - Developer Playground for Building Full-stack Web Apps, Fast'
    email: email
    token: token
    communityProjects: "https://hyperdev.com/community/"

# ROUTES

# Only routes under /about/* and /legal/* will appear at https://hyperdev.com/about/, etc.

app.head '/', (request, response) ->
  console.log "#{request.method} /"
  console.log request.headers

  response.write("OK")
  response.send()

app.get '/', (request, response) ->
  console.log "#{request.method}  /"
  console.log request.headers

  displayIndex(request, response)

app.get '/about', (request, response) ->
  console.log "#{request.method}  /about"
  console.log request.headers

  displayIndex(request, response)

app.get '/legal', (request, response) ->
  response.render 'legal',
    title: 'HyperDev – Legal Stuff'

# app.post '/about/register', (request, response) ->
#   {email} = request.body

#   console.log "Posted: ", email, request.body

#   title = "Beta signup for " + email
#   unless email
#     response.status(400).send({ error: "Please enter your email" })
#     return
#   # Create FB Beta User
#   # We'll need to either use request-promise or promiseify rq.post (or use callbacks)
#   rq.post
#     url: 'https://our.fogbugz.com/f/api/0/jsonapi'
#     json:
#       cmd: 'new'
#       sScoutDescription: title
#       sTitle: title
#       sCustomerEmail: email
#       sEvent: 'Marketing page signup'
#       token: process.env.FB_TOKEN
#       ixProject: process.env.FB_PROJECT
#       ixArea: process.env.FB_AREA
#       ixCategory: 3
#   .then -> # Redirect to the editor with the magic words
#     # response.redirect "https://hyperdev.com/?magicwords=" + process.env.MAGIC_WORDS + "&comingFrom=about" # remove magicwords param after update new-user-info pr ships
#     response.status(200).send()
#   .catch ->
#     response.status(500).send({ error: 'something blew up' })


# Must be after other routes
# Handle 404
app.use (req, res) ->
  res.status(404)
  res.sendfile('public/404.html')
