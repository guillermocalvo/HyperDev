activePalette = []
currentPalette = 0
pressingDown = false
pixels = []
PIXEL_SIZE = 20
CANVAS_SIZE = 400
canvasChanged = false

TRANSITION_END = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'

updateFeelsColor = () ->
  color = $('.active').css('background-color')
  $('.feels').css('color', color)

selectColor = (context) ->
  console.log 'selectColor'
  color = $(context).css('background-color')
  highlightActivePaletteColor(context)

highlightActivePaletteColor = (context) ->
  $('.color').removeClass('active')
  $(context).addClass('active')
  $(context).one TRANSITION_END, ->
    updateFeelsColor()

updatePalette = () ->
  for color, index in activePalette
    paletteContext = $('.palette-color')[index]
    $(paletteContext).css('background-color', color)
    if index is 0
      context = $('.palette-color')[0]
      selectColor(context)

newPalette = () ->
  totalPalettes = palettes.length - 1
  if currentPalette > totalPalettes
    currentPalette = 0
  activePalette = palettes[currentPalette]
  updatePalette()
  currentPalette = currentPalette + 1

newPalette()


$('.color').on 'click touchstart', ->
  console.log 'color click'
  context = @
  selectColor(context)

$(document).keypress (key) ->
  if key.which is 49
    context = $('.color')[0]
    selectColor(context)
  else if key.which is 50
    context = $('.color')[1]
    selectColor(context)
  else if key.which is 51
    context = $('.color')[2]
    selectColor(context)
  else if key.which is 52
    context = $('.color')[3]
    selectColor(context)
  else if key.which is 53
    context = $('.color')[4]
    selectColor(context)
  else if key.which is 54
    context = $('.color')[5]
    selectColor(context)
  else if key.which is 55
    $('.shuffle').trigger('click')

$('.shuffle').on 'click touchstart', ->
  console.log 'shuff;le'
  newPalette()

$('.shuffle').hover ->
  console.log this

# $('.shuffle .label').rainbow
#   colors: [
#     '#FF0000'
#     '#f26522'
#     '#fff200'
#     '#00a651'
#     '#28abe2'
#     '#2e3192'
#     '#6868ff'
#   ]
#   animate: true
#   animateInterval: 100
#   pad: false
#   pauseLength: 100


# DRAWING

$('.pixel').on "mousedown touchstart", (event) ->
  console.log 'hiyo'
  color = $('.color.active').css('background-color')
  pressingDown = true
  $(@).css("background-color", color)
  unless color is 'black'
    canvasChanged = true

$(document).mouseup ->
  pressingDown = false

$('.pixel').on "mousemove", (event) ->
  color = $('.color.active').css('background-color')
  if pressingDown
    $(event.target).css("background-color", color)


$('.pixel').on "touchmove", (event) ->
  color = $('.color.active').css('background-color')
  console.log 'hi'
  if pressingDown
    event.preventDefault()
    myLocation = event.originalEvent.changedTouches[0]
    realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY) or @
    console.log realTarget
    if $(realTarget).hasClass 'pixel'
      $(realTarget).css("background-color", color)






# SAVING

getPixels = () ->
  drawing = $('.drawing .pixel')
  pixels = []
  for pixel in drawing
    pixelColor = $(pixel).css('background-color')
    pixels.push(pixelColor)

paintCanvasRow = (pixelColor, index, row) ->
  X = PIXEL_SIZE * index - (CANVAS_SIZE * row)
  Y = PIXEL_SIZE * row
  canvas = document.getElementById("canvas")
  context = canvas.getContext '2d'
  context.fillStyle = pixelColor
  context.fillRect(X, Y, PIXEL_SIZE, PIXEL_SIZE)

drawPixelsOnCanvas = (pixels) ->
  for pixelColor, index in pixels
    if index < 20
      paintCanvasRow(pixelColor, index, 0)
    if index < 40
      paintCanvasRow(pixelColor, index, 1)
    if index < 60
      paintCanvasRow(pixelColor, index, 2)
    if index < 80
      paintCanvasRow(pixelColor, index, 3)
    if index < 100
      paintCanvasRow(pixelColor, index, 4)
    if index < 120
      paintCanvasRow(pixelColor, index, 5)
    if index < 140
      paintCanvasRow(pixelColor, index, 6)
    if index < 160
      paintCanvasRow(pixelColor, index, 7)
    if index < 180
      paintCanvasRow(pixelColor, index, 8)
    if index < 200
      paintCanvasRow(pixelColor, index, 9)
    if index < 220
      paintCanvasRow(pixelColor, index, 10)
    if index < 240
      paintCanvasRow(pixelColor, index, 11)
    if index < 260
      paintCanvasRow(pixelColor, index, 12)
    if index < 280
      paintCanvasRow(pixelColor, index, 13)
    if index < 300
      paintCanvasRow(pixelColor, index, 14)
    if index < 320
      paintCanvasRow(pixelColor, index, 15)
    if index < 340
      paintCanvasRow(pixelColor, index, 16)
    if index < 360
      paintCanvasRow(pixelColor, index, 17)
    if index < 380
      paintCanvasRow(pixelColor, index, 18)
    if index < 400
      paintCanvasRow(pixelColor, index, 19)

saveCanvas = () ->
  canvas = document.getElementById("canvas")
  drawing = canvas.toDataURL("image/png")
  feeling = $('.topic')[0].textContent
  $.post '/save-drawing', {'image': drawing, feeling: feeling}, (response) ->
    if response.code is 200
      console.log response
      $('.save-drawing').hide()
      $('.drawing-saved').show()
      $('.palette').hide()
      $('.drawing').hide()
      $('#canvas').show()
    else
      console.log response
      $('.save-drawing').hide()
      $('.drawing-saved').show()
      $('.palette').hide()
      $('.drawing').hide()
      $('#canvas').show()

$('.save-button').on 'click touchstart', ->
  console.log 'save button'
  if canvasChanged
    $(this).addClass 'hidden'
    $('.saving-button').removeClass 'hidden'
    getPixels()
    drawPixelsOnCanvas(pixels)
    saveCanvas()

$('.sign-up form').submit ->
  input = $('.sign-up input')
  input.removeClass('error')
  email = input.val()
  $('.validating-button, .submit').toggleClass 'hidden'
  $.post "/sign-up", {email: email}
    .always (response) ->
      if response
        $('.sign-up, .sign-up-success').toggleClass 'hidden'
      else
        $('.validating-button, .submit').toggleClass 'hidden'
        input.addClass('error')
  return false

# clearCanvas = () ->
#   canvas = document.getElementById("canvas")
#   context = canvas.getContext '2d'
#   context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
#   $('.pixel').css('background-color', '')

$('.draw-another').on 'click touchstart', ->
  console.log 'another'
  location.reload()
