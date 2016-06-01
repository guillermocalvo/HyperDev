$('.reject').click (event) ->
  button = $(event.target).closest('button')[0]
  data = $(button).data()
  $.post '/remove-drawing', data, (response) ->
    button.innerHTML = 'Rejecting...'
    if response.code is 200
      node = $(event.target).closest('.drawing')
      console.log 'rejected successful ', data
      node.remove()
    else
      console.log 'error'



$('.send-weekly-email').click (event) ->
  button = $(event.target).closest('button')[0]
  data = $(button).data()
  # posts secret from env
  $.post '/send-weekly-email', data, (response) ->
    button.innerHTML = 'Sending...'
    if response.code is 200
      $('.send-weekly-email').addClass 'hidden'
      $('.email-success-message').removeClass 'hidden'
    else
      console.log 'error'
