window.onload = ->
  Gifffer()
  
  document.querySelector('input')?.focus()


validateEmail = (email) ->
  regex = /.+@.+\..+/
  regex.test(email)

Array::forEach.call document.querySelectorAll('form'), (form) ->
  input = form.querySelector('input')

  input.addEventListener 'input', (e) ->
    email = input.value

    if validateEmail(email)
      input.classList.remove('error')

  form.addEventListener 'submit', (e) ->
    e.preventDefault()

    email = input.value
    valid = validateEmail(email)

    unless valid
      input.classList.add('error')

      return

    $.post "/about/register",
      email: email

    form.remove()
    $(".form-submitted").removeClass('hidden')
