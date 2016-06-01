# Recipe builder

## WHAT AM I?!

A quick and dirty little script that fetches the contents of checlists for all cards on a list, and puts them together in one place.

I keep my recipes in Trello, and make a checklist of my ingredients. This example lets me put my recipes for the week on a shopping list, then pull and consolidate my ingredients. I can check off what I already have and head to the store with a complete grocery list. **Caution** does NOT stop impulse purchases of sandwich cookies.

## HOW AM I?!

  - Remix this project.
  - in .env, add:
    - A [Trello application key](https://trello.com/app-key)
    - A [List ID](https://developers.trello.com/get-started/start-building) (look under **Finding a List ID** or use [mine](https://trello.com/b/Ru420W0r/recipe-demo-board) (5747a11385eabc0b3236096b)
  - Add you some recipes and ingredient checklists (not necessary with my sample board). The recipes must follow the format:
    - <quantity> <unit>: <ingredient>
  - click "Show" when your project is live.

Feeling adventurous? Make sure all feature switches are enabled in the front-end client.js file.

## WHERE AM I (GOING) ?!

It's basically functional now, but there's lots of nifty features that can be added. Remix, throw in another feature switch, and see what you can add. Some ideas:

  - Show the card titles, so you know what yummy things you're eating!
  - Provide a list of Lists in the UI after authenticating (no more hard-coded lists in .env)
  - Preparation instructions for the ingredients (chopped, etc.).
  - Unit recognition and conversion (teaspoons, tablespoons, cups, etc.)
  - Smarter parsing (get rid of the colon requirement)
    - (quantity) (units)? ingredient \(prep instructions\)?/
