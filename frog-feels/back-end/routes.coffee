async = require 'async'
express = require 'express'
router = express.Router()
Xray = require 'x-ray'
xray = Xray()
urlRegex = require "url-regex"
_ = require 'underscore'
isValidEmail = require 'is-valid-email'

palettes = require './palettes'
drawingMethods = require './drawing'
feelings = []

getFeelings = -> # Array
  xray('https://feelings.blackfriday', ['p']) (error, scrapedFeelings) ->
    feelings = _.compact scrapedFeelings
    feelings = feelings.slice(3, 32)
    feelings = _.filter feelings, (feeling) ->
      feeling.length < 400 and not urlRegex().test feeling
setInterval getFeelings, 1000 * 60

async.series [
  async.asyncify getFeelings
  async.asyncify drawingMethods.connectToDB()
  ], ->
    router.get '/', (request, response) ->
      response.render 'index.jade',
        title: 'Frog Feels'
        feeling: _.sample feelings
        palettes: _.shuffle palettes

    router.post '/save-drawing', (request, response) ->
      drawing = request.body.image
      drawing = drawing.substring drawing.indexOf('base64,')+7
      drawingBuffer = new Buffer(drawing, 'base64')
      feeling = request.body.feeling
      drawingMethods.saveAnonymousDrawing(drawingBuffer, feeling, response)

    router.post '/sign-up', (request, response) ->
      email = request.body.email
      if isValidEmail(email)
        drawingMethods.saveEmailToDB email
        response.send true
      else
        response.send false

    router.post '/remove-drawing', (request, response) ->
      drawingMethods.removeDrawing(request, response)

    router.get '/last-week', (request, response) ->
      drawingMethods.getLastWeek(response)

    router.post '/send-weekly-email', (request, response) ->
      console.log 'request received: ', request.body
      if request.body.secret is process.env.EMAIL_SECRET
        drawingMethods.generateWeeklyEmail(response)
        # response.send
          # code: 200
        # drawingMethods.generateWeeklyEmail(response)

module.exports = router
