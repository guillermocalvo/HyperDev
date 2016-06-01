# real projects and users... but still needs to go to a database, one day
module.exports =

  categories: -> [
      name: 'Cool Projects'
      metaName: 'cool-projects'
      img: 'https://s3.amazonaws.com/hyperweb-editor-assets/us-east-1%3Ab0bac0a2-1470-4ff8-b72d-acc002ba0a16%2Fcomputer.svg'
      description: null
      id: 1
    ,
      name: 'Start by Remixing These'
      metaName: 'getting-started'
      img: 'https://s3.amazonaws.com/hyperweb-editor-assets/us-east-1%3Ab0bac0a2-1470-4ff8-b72d-acc002ba0a16%2Fhdbook_small.png'
      description: null
      id: 2
  ]

  # sample projects fetched from id
  projects: -> [
      name: 'Memory!'
      projectId: 1
      editorUrl: 'coconut-firefly'
      appUrl: 'https://coconut-firefly.hyperdev.space/?theme=dog'
      likes: 26
      remixes: null
      description: 'Memory matching game with different themes for cards'
      users: [
        name: 'etamponi'
        avatar: 'https://avatars3.githubusercontent.com/u/578612?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Kerbal Space Program'
      projectId: 2
      editorUrl: 'quasar-death'
      appUrl: 'https://quasar-death.hyperdev.space/'
      likes: 18
      remixes: null
      description: "Launch your spaceship into orbit. Don't die."
      users: [
        name: 'InPermutation'
        avatar: 'https://avatars0.githubusercontent.com/u/1096993?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Pong Solo'
      projectId: 3
      editorUrl: 'crack-thumb'
      appUrl: 'https://crack-thumb.hyperdev.space/'
      likes: 5
      remixes: null
      description: "Play Pong against a brick wall; now even harder to beat!"
      users: [
        name: 'STRd6'
        avatar: 'https://avatars2.githubusercontent.com/u/18894?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Fancy Soundboard'
      projectId: 4
      editorUrl: 'aquamarine-foot'
      appUrl: 'https://aquamarine-foot.hyperdev.space/'
      likes: 21
      remixes: null
      description: 'Click pictures, listen to sounds, celebrate'
      users: [
          name: 'STRd6'
          avatar: 'https://avatars2.githubusercontent.com/u/18894?v=3&s=48'
        ,
          name: 'pketh'
          avatar: 'https://avatars2.githubusercontent.com/u/877072?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'SVG Editor'
      projectId: 5
      editorUrl: 'jelly-snap'
      appUrl: 'https://jelly-snap.hyperdev.space/'
      likes: 3
      remixes: null
      description: "A thing for making SVG images. Draw with it."
      users: [
          name: 'InPermutation'
          avatar: 'https://avatars0.githubusercontent.com/u/1096993?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'HyperDev Tutorial'
      projectId: 6
      editorUrl: 'denim-warlock'
      appUrl: 'https://denim-warlock.hyperdev.space/'
      likes: 15
      remixes: null
      description: "An introduction to HyperDev to get you building your own apps"
      users: [
          name: 'nancyhawa'
          avatar: 'https://avatars2.githubusercontent.com/u/10010598?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'React Tutorial'
      projectId: 7
      editorUrl: 'shade-king'
      appUrl: 'https://shade-king.hyperdev.space/'
      likes: 4
      remixes: null
      description: "A simple but realistic comments box"
      users: [
        name: 'garethx'
        avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Data Dashboard'
      projectId: 8
      editorUrl: 'square-mare'
      appUrl: 'https://square-mare.hyperdev.space/'
      likes: 13
      remixes: null
      description: "Display data from Google Sheets"
      users: [
        name: 'garethx'
        avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Socket.io Chat'
      projectId: 9
      editorUrl: 'quasar-vole'
      appUrl: 'https://quasar-vole.hyperdev.space/'
      likes: 9
      remixes: null
      description: "A simple chat demo for Socket.io"
      users: [
        name: 'garethx'
        avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Lua Compiler'
      projectId: 10
      editorUrl: 'shag-legs'
      appUrl: 'https://shag-legs.hyperdev.space/'
      likes: 18
      remixes: null
      description: "A basic Lua to x86 Assembly compiler, in JavaScript"
      users: [
        name: 'InPermutation'
        avatar: 'https://avatars0.githubusercontent.com/u/1096993?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Sending Email'
      projectId: 11
      editorUrl: 'curse-mare'
      appUrl: 'https://curse-mare.hyperdev.space/'
      likes: 8
      remixes: null
      description: "Email sending form with React and Nodemailer"
      users: [
        name: 'garethx'
        avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'API Endpoint'
      projectId: 12
      editorUrl: 'lily-pegasus'
      appUrl: 'https://lily-pegasus.hyperdev.space/'
      likes: 3
      remixes: null
      description: "GET and POST API endpoints using Express"
      users: [
        name: 'garethx'
        avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'MongoDB Example'
      projectId: 13
      editorUrl: 'navy-flower'
      appUrl: 'https://navy-flower.hyperdev.space/'
      likes: 5
      remixes: null
      description: "Connect and add items to a MongoDB"
      users: [
        name: 'garethx'
        avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Authentication Example'
      projectId: 14
      editorUrl: 'maple-dutchess'
      appUrl: 'https://maple-dutchess.hyperdev.space/'
      likes: 9
      remixes: null
      description: "Auth app using Passport.js and OAuth providers"
      users: [
          name: 'bigdogwillfeed'
          avatar: 'https://avatars3.githubusercontent.com/u/4453639?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Persistence Demo using DynamoDB'
      projectId: 15
      editorUrl: 'typhoon-pine'
      appUrl: 'https://typhoon-pine.hyperdev.space/'
      likes: 9
      remixes: null
      description: "Shows use of the key-value store available in HyperDev"
      users: [
          name: 'etamponi'
          avatar: 'https://avatars3.githubusercontent.com/u/578612?v=3&s=48'
        ,
          name: 'garethx'
          avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Backbone.js TodoMVC'
      projectId: 16
      editorUrl: 'plain-thumb'
      appUrl: 'https://plain-thumb.hyperdev.space/'
      likes: 3
      remixes: null
      description: "A Todo list app using Backbone.js"
      users: [
          name: 'garethx'
          avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Test Before Deploy'
      projectId: 17
      editorUrl: 'blossom-scorpion'
      appUrl: 'https://blossom-scorpion.hyperdev.space/'
      likes: 13
      remixes: null
      description: "Adding tests before deploy with Mocha and Chai"
      users: [
          name: 'etamponi'
          avatar: 'https://avatars3.githubusercontent.com/u/578612?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'D3 Server-side SVG Charts'
      projectId: 18
      editorUrl: 'fair-sage'
      appUrl: 'https://fair-sage.hyperdev.space/'
      likes: 2
      remixes: null
      description: "Rendering SVG charts on the server-side with D3"
      users: [
          name: 'garethx'
          avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Browserify Middleware Hello World'
      projectId: 19
      editorUrl: 'yelow-grin'
      appUrl: 'https://yelow-grin.hyperdev.space/'
      likes: 5
      remixes: null
      description: "Basic Browserify Middleware Hello World example"
      users: [
          name: 'STRd6'
          avatar: 'https://avatars2.githubusercontent.com/u/18894?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Sending SMS with Twilio'
      projectId: 20
      editorUrl: 'razor-sprite'
      appUrl: 'https://razor-sprite.hyperdev.space/'
      likes: 9
      remixes: null
      description: "Use Twilio to send SMS alerts on page error"
      users: [
          name: 'garethx'
          avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Map IP Address with Google Maps'
      projectId: 21
      editorUrl: 'ivy-dart'
      appUrl: 'https://ivy-dart.hyperdev.space/'
      likes: 7
      remixes: null
      description: "Maps the location of your IP address"
      users: [
          name: 'garethx'
          avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Trello Webhook Server'
      projectId: 22
      editorUrl: 'zinc-chopper'
      appUrl: 'https://zinc-chopper.hyperdev.space/'
      likes: 9
      remixes: null
      description: "Lists Trello board activity via webhooks"
      users: [
          name: 'garethx'
          avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'CoffeeScript, Jade & Stylus Sample'
      projectId: 23
      editorUrl: 'foul-raptor'
      appUrl: 'https://foul-raptor.hyperdev.space/'
      likes: 5
      remixes: null
      description: "A really nice way to start your next project"
      users: [
          name: 'pketh'
          avatar: 'https://avatars2.githubusercontent.com/u/877072?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Simply Done'
      projectId: 24
      editorUrl: 'veil-field'
      appUrl: 'https://veil-field.hyperdev.space/'
      likes: 15
      remixes: null
      description: "A simple, minimalist Todo app"
      users: [
          name: 'enriquesanchez'
          avatar: 'https://avatars2.githubusercontent.com/u/3276087?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Web Scraper Sample'
      projectId: 25
      editorUrl: 'brook-yak'
      appUrl: 'https://brook-yak.hyperdev.space/'
      likes: 7
      remixes: null
      description: "Web scraper using scrape-it"
      users: [
          name: 'garethx'
          avatar: 'https://avatars3.githubusercontent.com/u/1830035?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Bootstrap Geo Template'
      projectId: 26
      editorUrl: 'snapdragon-crown'
      appUrl: 'https://snapdragon-crown.hyperdev.space/'
      likes: 7
      remixes: null
      description: "Geocities theme for Bootsrap 2. Double retro, double broken images."
      users: [
          name: 'STRd6'
          avatar: 'https://avatars2.githubusercontent.com/u/18894?v=3&s=48'
      ]
      categoryId: 2
    ,
      name: 'Slack Bogan Ipsum Slash Command'
      projectId: 27
      editorUrl: 'wheat-flower'
      appUrl: 'https://wheat-flower.hyperdev.space/'
      likes: 7
      remixes: null
      description: "Pretty dang useless, but you can grief all over Slack"
      users: [
          name: 'bigdogwillfeed'
          avatar: 'https://avatars3.githubusercontent.com/u/4453639?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Learn ASL Alphabet'
      projectId: 28
      editorUrl: 'dawn-haze'
      appUrl: 'https://dawn-haze.hyperdev.space/'
      likes: 7
      remixes: null
      description: "Practice the ASL fingerspelled alphabet"
      users: [
          name: 'jude'
          avatar: 'https://pbs.twimg.com/profile_images/627115681201430528/0rE2ZRqj.jpg'
      ]
      categoryId: 1
    ,
      name: 'Display Data from Excel'
      projectId: 29
      editorUrl: 'void-horn'
      appUrl: 'https://void-horn.hyperdev.space/'
      likes: 9
      remixes: null
      description: "Read and display data from a .xlsx file on Dropbox"
      users: [
          name: 'jude'
          avatar: 'https://pbs.twimg.com/profile_images/627115681201430528/0rE2ZRqj.jpg'
      ]
      categoryId: 2
    ,
      name: 'L-system Demo'
      projectId: 30
      editorUrl: 'flicker-swoop'
      appUrl: 'https://flicker-swoop.hyperdev.space/'
      likes: 7
      remixes: null
      description: "Example implementation of a Lindenmayer system"
      users: [
          name: 'STRd6'
          avatar: 'https://avatars2.githubusercontent.com/u/18894?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Slack Channel Sentiment Analysis'
      projectId: 31
      editorUrl: 'mulberry-stealer'
      appUrl: 'https://mulberry-stealer.hyperdev.space/'
      likes: 27
      remixes: null
      description: "Display a sentiment score for your Slack channels"
      users: [
          name: 'nancyhawa'
          avatar: 'https://avatars2.githubusercontent.com/u/10010598?v=3&s=48'
        ,
          name: 'LouManglass'
          avatar: 'https://avatars3.githubusercontent.com/u/241059?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Trello Shopping List Generator'
      projectId: 32
      editorUrl: 'forest-mouse'
      appUrl: 'https://forest-mouse.hyperdev.space/'
      likes: 15
      remixes: null
      description: "Auto-generate a shopping list from Trello recipe checklists"
      users: [
          name: 'LouManglass'
          avatar: 'https://avatars3.githubusercontent.com/u/241059?v=3&s=48'
      ]
      categoryId: 1
    ,
      name: 'Frog Feels'
      projectId: 33
      editorUrl: 'sky-carver'
      appUrl: 'https://sky-carver.hyperdev.space'
      likes: 36
      remixes: null
      description: 'Draw some feelings, see what everyone else drew weekly'
      users: [
          name: 'pketh'
          avatar: 'https://avatars2.githubusercontent.com/u/877072?v=3&s=48'
      ]
      categoryId: 1

  ]
