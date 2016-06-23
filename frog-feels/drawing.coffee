async = require 'async'
fs = require 'fs'
uuid = require 'node-uuid'
moment = require 'moment'
_ = require 'underscore'
knox = require 'knox'
juice = require 'juice'

# Sendgrid = require 'sendgrid-web'
# sendgrid = new Sendgrid
#   user: process.env.SENDGRID_USER
#   key: process.env.SENDGRID_KEY

sendgrid = require('sendgrid')(process.env.SENDGRID_KEY)

mongojs = require 'mongojs'
db = mongojs("#{process.env.DB_USER}:#{process.env.DB_PASS}@#{process.env.DB_URL}")
db.on 'connect', ->
  console.log 'database connected'
  # db.collection('Drawings').createIndex
  #   "path": "text"
db.on 'error', (error) ->
  console.log "database error: ", error

s3 = knox.createClient
  key: process.env.S3_ACCESS_KEY_ID
  secret: process.env.S3_SECRET_ACCESS_KEY
  bucket: process.env.S3_BUCKET_PATH

drawingsGroupedByFeeling = []
# lastWeeksDrawings = []
# lastWeeksFeelings = []
subscribedUsers = []

self =
  
  connectToDB: ->
    db.getCollectionNames (error, collections) ->
      console.log collections
      if error
        console.log error

  saveDrawingToS3: (path, drawingBuffer) ->
    console.log 'saving drawing to s3'
    headers =
      'Content-Type': 'image/png'
      'x-amz-acl': 'public-read'
    s3.putBuffer drawingBuffer, path, headers, (error, s3Response) ->
      console.log error

  saveDrawingInfoToDB: (path, feeling) ->
    console.log 'updating db'
    date = (new Date).toString()
    db.collection('Drawings').save
      created: date
      path: path
      feeling: feeling

  saveAnonymousDrawing: (drawingBuffer, feeling, response) ->
    date = "/#{moment().year()}-#{moment().week()}/" # /2016-51/
    filename = "#{uuid.v4()}.png"
    path = date + filename
    async.series [
      async.asyncify self.saveDrawingToS3 path, drawingBuffer
      async.asyncify self.saveDrawingInfoToDB path, feeling
    ], ->
      response.send
        code: 200
        drawing: path
        feeling: feeling

  saveEmailToDB: (email) ->
    date = (new Date).toString()
    db.collection('Users').save
      created: date
      email: email



  # /last-week methods

  generateWeeklyEmail: (response) -> 
    async.waterfall [
      self.getLastWeekDrawings
      self.getDrawingsGroupedByFeelings
      self.getUsers
    ], (error, result) ->
      if error
        console.log error
      response.render 'last-week.jade',
        feelingGroups: drawingsGroupedByFeeling
        admin: false
      ,
      (error, html) ->
        if error
          console.log error
        html = juice html, {applyWidthAttributes: true}
        self.sendMail html
  
  sendMail: (html) ->
    sendgrid.send
      to: 'pirijan@gmail.com'
      from: 'frog@frog.beer'
      fromname: 'Frog Beer'
      replyTo: 'hi@pketh.org'
      subject: "🐸💕 Last Week's Feelings"
      html: html
      ,
      (error, json) ->
        if error
          console.log error
        console.log json

  getLastWeek: (response) ->
    async.waterfall [
      self.getLastWeekDrawings
      self.getDrawingsGroupedByFeelings
      self.getUsers
    ], (error, result) ->
      if error
        console.log error
      response.render 'last-week.jade',
        users: subscribedUsers
        feelingGroups: drawingsGroupedByFeeling
        admin: process.env.ADMIN
        emailSecret: process.env.EMAIL_SECRET

  getLastWeekDrawings: (callback) ->
    lastWeeksDrawings = []
    lastWeeksFeelings = []
    lastWeek = "#{moment().year()}-#{moment().week() - 1}"
    # thisWeek = "#{moment().year()}-#{moment().week() - 0}"
    db.collection('Drawings').find (error, drawings) ->
      for drawing in drawings
        if drawing.path.indexOf(lastWeek) > -1
          lastWeeksDrawings.push drawing
          lastWeeksFeelings.push drawing.feeling
      callback null, _.uniq(lastWeeksFeelings), lastWeeksDrawings

  getDrawingsGroupedByFeelings: (uniqueFeelings, lastWeeksDrawings, callback) ->
    # console.log lastWeeksDrawings
    drawingsGroupedByFeeling = []
    for feeling in uniqueFeelings
      group =
        feeling: feeling
        drawings: []
      for drawing in lastWeeksDrawings
        if drawing.feeling is feeling
          group.drawings.push 
            path: drawing.path
      drawingsGroupedByFeeling.push group
    callback null

  getUsers: (callback) ->
    db.collection('Users').find (error, users) ->
      subscribedUsers = []
      for user in users
        subscribedUsers.push user.email
      callback null

  removeDrawing: (request, response) ->
    path = request.body.path
    console.log path
    db.collection('Drawings').remove {path: path}, (error, doc) ->
      if error
        console.log error
      console.log doc
      response.send
        code: 200


module.exports = self
