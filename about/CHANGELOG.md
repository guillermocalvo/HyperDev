# CHANGELOG

        _
      -=\`\
  |\ ____\_\__
-=\c`""""""" "`)
   `~~~~~/ /~~`
     -==/ /
       '-'

May 10, 2016
Pirijan:
- cleaned up beta badge (styling will carry over into the app)
- made 2ndary cta (community projects site) more predicatable and consistent with the app
- footer and header cta sections are consistent
- removed '!'s from copy

May 11, 2016
Pirijan and Daniel
- nudged up the space between cta and header section: the header block is getting more crowded and condensed. Density increases the perception of length of the page.
- clean up jade template w img vars, and using nesting instead of long string interpolation
- use giffer for gif playback control (plays once when in view, hover or click to resume looping). This should mitigate the issue of gifs distracting the reader from reading.
- beta badge displayed about form because it's contextually relevant
- consolidated cta forms into partials
- removed tokens and conditional link text from server, all users see the input and submit (if you have an email param, the input is prefilled for you)

May 12, 2016
Gareth
- fixed problem with copy below 'remix your project' gif not displaying on a continuous line
- added other logos to 'made by' section in response to feedback

May 12, 2016
Nathan:
- fixed 'HyperDev' hyperlink in top section links to /undefined when accessing the page directly - presumably if it lacks a token? e.g. hyperdev.com/about/undefined or cosmic-panther.hyperdev.space/undefined. Header link always goes to hyperdev.com
- link to legal needed trailing slash to work with the current cloud front behaviors

May 12, 2016
Pirijan: 
- use cloudfront compatible /about/ root paths for public files to allow remixed projects to work just like /about/ will
- FIX: the addition of play buttons to the gifs forces horizontal scrolling on mobile
- clean up illustration code
- add `header` template
- replace seo-meta template will a full `head` template
- add intro to giffer.js
- add 'community projects' to the footer

2nd release:
- convert to using all em/rem/%-size for proportional sizes and container width (medium-esque)
- fix screenshot/canvas sizes on window resize
- style adjustments for bigger sizes on big screens
- simplified made-by illustration/logos


May 16, 2016
Daniel
- switch to private beta. form submit, 

May 17, 2016
Pirijan
- fixed responsive layout bug


## todo later
- nav bar for community projects, blog , etc. (put that stuff in the footer too)
- bug: resizing browser breaks thumbnails (basically involves rewriting giffer)
