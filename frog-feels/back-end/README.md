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

- email formatted with proper styles/layout
- frogfeels.com weekly 💕s [img1. img2, ... img5]

- header: seo meta tag stuff (twitter / fb)

- fix iphone (320px) layout
- fix touchstart draw


later features:
---------------
- add kidpixy sound effects (save success, refreshing, drawing(mousedown on canvas that repeats), pick color)

- ? show last weeks drawings on page (see `SCRAPS.md`)

refactor cleanup:
-----------------
- clean up the class hide/show stuff to use clean code

- update css/jade class names to match simplified app

- quickfix async scrapper issue (meh) - possibly just use fallback string, and manually periodically change it

- make mongo drawing find call more efficient

- ?smaller grid? (see existing media queries, see common device size usage scenarios (use responsive design view))
