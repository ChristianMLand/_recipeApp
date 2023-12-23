## Recipe collection App
-----------------------
TECHNOLOGY
----------------------
- https://github.com/hhursev/recipe-scrapers
- react front end
- python flask back end
- mysql db?
-----------------------
FEATURES
-----------------------
- [ ] REFACTOR CSS TO USE MODULES AND REMOVE DUPES
- [ ] checklist for what ingredients/steps you have done so far
- [ ] nutrition facts based on ingredients
- [ ] able to share recipes with other people 
    - [ ] generate a web page presenting the recipe data and email it (?)
- [ ] hover over ingredient name in instructions to show a popover with the quantity (?)
- [ ] form to add a recipe to your collection
    - [ ] takes in a url for the website
    - [ ] scrape the web page and parse out relevant data
        - [ ] title of recipe
        - [ ] image of the recipe
        - [ ] ingredients for recipe (with quantities)
        - [ ] directions/instructions for the recipe
        - [ ] number of servings for the recipe
        - [ ] total time for the recipe
    - [ ] before saving to your collection, you will have a chance to edit the scraped data in case there is anything missing or incorrect
- [ ] when adding/editing a recipe, have option to upload a photo from device, instead of just image url
- [ ] recipe calculator (adjust ingredient amounts based on desired number of servings)
- [ ] be able to categorize your recipes into custom categories/labels for organization
    - [ ] labels for things like type of food, what culture its from, main ingredient, etc
- [ ] able to give ratings to the recipes after you have made them
- [ ] keep track of how many times you have used/made the recipe (I made this button with counter somewhere on the recipe view page)
    - [ ] keep track of when you last used/made the recipe
- [ ] able to add notes to the recipes in your collection
- [ ] advanced recipe filtering
    - [ ] filter based on ingredients
        - [ ] be able to filter for recipes that either have any of the desired ingredients, or all of them
    - [ ] filter based on time
    - [ ] filter based on categories/labels
    - [ ] filter based on title

-------------------
ROADMAP
--------------------
- V1 will only have manually entered recipes
- V2 will use a web scraper with pre-built parsers for specific domains to process recipe information
- V3 will use a web scraper with ai as the parser to hopefully work for any domain to process recipe information
--------------------
CHALLENGES
---------------------
- finding a free ai llm that can process the data via api
- standardizing units across recipes so the recipe calculator can work
