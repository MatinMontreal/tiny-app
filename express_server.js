var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs")

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

var urlDatabase = {

  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});



app.get("/urls/new", (req, res) => {
  let templateVars = { longURL:longURL, shortURL: req.params.id, inputName: loggedIn
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  //We need to creat a shortURL
  console.log('Post URL');
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls/' + shortURL );
  //Add the short and the long URl to the database
});

app.get("/urls/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id];
  let templateVars = { longURL:longURL, shortURL: req.params.id, inputName: loggedIn
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];
  //delete the item from the object
  res.redirect("/urls");

});

app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  //delete the item from the object
  res.redirect("/urls");

});

app.get("/urls", (req, res) => {
  console.log ("Get URLs");
  let templateVars = { urls: urlDatabase,
    inputName: loggedIn
    };
  console.log(templateVars)
  res.render("urls_index", templateVars);
});


var loggedIn= {};

app.post("/login", (req, res) => {
  if(req.body.username !== null){
  (res.cookie('username', req.body.username);
  let logInName = req.body.username;
  loggedIn['UserID'] = logInName;
  console.log(loggedIn);
  res.redirect("/urls");
  } else {
    res.clearCookie('name')
  }
});





// In order to handle the form submission, add an endpoint to handle a POST to /login in your Express server.

// Use the endpoint to set the cookie parameter called username to the value submitted
// in the request body via the form.

// As a reminder, in order to set a cookie, we can use res.cookie, as provided by Express.
// You don't need to provide the (optional) options for now.

// After your server has set the cookie it should redirect the browser back to the /urls page.



app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});








