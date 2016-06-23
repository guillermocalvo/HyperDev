# Frog Feels

    _    _
   (o)--(o)
  /.______.\
  \__|__|__/
 ./        \.
( .        , )
 \ \_\\//_/ /
  ~~  ~~  ~~


Get some feelings, draw some feelings

Brought back from the dead and updated for http://susanhamilton.online/gallery.txt

## What?

on refresh, get a random feeling from https://feelings.blackfriday/feelings.txt ((max length restriction: can be long, sentence length~)

show the pixel editor, user draws a thing

on save, I save the drawing and the feeling associated with it

then uncomment out `/last-week` and generate the email to send out at the end of the week. manual process for basic broken drawing check. I could do this on a schedule but this is easier and safer. And maybe more fulfilling.

## TODO
- template vars to ALL_CAPS
- frogfeels.com weekly 💕s [img1. img2, ... img5]
- /last-week uses hardcoded txt logo FROG_STATIC
- admin text-field on /last-week
- email formatted with proper styles/layout


later features:
---------------

- add kidpixy sound effects (save success, refreshing, drawing(mousedown on canvas that repeats), pick color)

- add imessages style celebration streamers canvas/bk on drawing complete (adds that extra bit of short term endorphin rush on completion)


refactor cleanup:
-----------------

- fix race condition w db not loading/scraping in time of page load (make it a decoupled service, w transparent loading)

- clean up the class hide/show stuff to use clean code

- update css/jade class names to match simplified app

- make mongo drawing find call more efficient
