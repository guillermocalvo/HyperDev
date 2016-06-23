# Hello!
Welcome to my postcard maker!

Hopefully this will give you a little peak into how you can use hyperdev to build modular and quick proofs-of-concept.

Let's start by taking a look at the frontend.

Because we don't have access to `require` on the frontend of hyperdev (_yet_) we use cdnjs to explictely require all the libraries we'll need. 

Those libraries are:
- *react* and *react-dom*, for rendering the ui onto the page
- *babel-core* for es2015 goodness
- *superagent* for a nicer request api 

Add our stylesheet and favicon for prettiness of course.

We also include all our javascript files. Flagging them with `type="text/babel"` tells babel-core we would like it to parse it and convert the result to browser-friendly js.

Next we include all our react components and attach them to the window so we can require them in other files.

Finally we include our helper methods as well as the `app.js` file that will kick off react.

While this isn't exactly the cleanest approach to frontend architecture, the limited scope of the project and the BEM style naming conventions helps fight the leakiness of global scope. This is okay initially but if we ever had a significant codebase we'd want to require all files in a build process that outputs a single js file.

Now for the backend, this is where hyperdev really comes into it's own. We require all the libraries we'll be needing as will as passing them API secrets that are taken from our .env file. Here I am using two external libraries:

The first, cloudinary.com, takes care of image storing as well as the resizing and cropping for print. Think of it imagemagick via an with url paramaters.

The second, lob.com prints and posts the postcards on our behalf. We can access our API secrets via `process.env[OUR_SECRET_NAME]`.

After setting these up we can use them out our various api endpoints. In this example I am using express, a popular node.js framework. I'll point out a few key things I'm using it for.

```
app.use(express.static('public'))
```

This tells express to serve all the contents of the `/public` folder as if it were a static file system, like ftp, accessible at the `http://ourdomain.com/`.

```
app.get("/countries", function(request, response) {
  Lob.countries.list(function (err, res) {
    response.send(res)
  })
})
```

Here we're telling express to intercept all requests made to `/countries`, make another request to Lob for a list of the countries, then return the results from the second request in response to the first.

```
app.post('/upload', function(request, response){
  var form = new formidable.IncomingForm()
  form.parse(request, function(err, fields, files) {
    cloudinary.uploader.upload(files.image.path, function(result) { 
      response.send(result)
    })
  })
})
```

Similarly, whenever express receives a request to `/upload` we parse the form with the formidable library. Once formidable receives the file we can handball the url of where it is being stored locally over to cloudinary.

```
app.post("/postcard", function (request, response) {
  var form = new formidable.IncomingForm()
  form.parse(request, function(err, fields, files) {
    Lob.postcards.create(
      fields, function (err, res) {
        if(!err) {
          remaining = remaining - 1
          response.send(res.body);
        } else {
          response.send(err)
        }
      }
    )
  })
})
```

Finally we use formidable again to parse the form fields for our postcard, create a new postcard on lob and update the remaining number of postcards. 
I hope this gave you a bit of insight into how you might use hyperdev for a quick project yourself.

If you have any questions you can reach out to me via twitter @sammargalit.