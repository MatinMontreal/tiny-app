var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs")

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

var urlDatabase = {

  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "MatYoung": {
    id: "MatYoung",
    email: "MatYoung@aol.com",
    password: "a"
  },
 "MatWashDC": {
    id: "MatWashDC",
    email: "MatWashDC@aol.com",
    password: "dishwasher-funk"
  }
}


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

app.get("/register", (req, res) => {
  let templateVars = { inputName: loggedIn,
  };
  res.render("urls_registration", templateVars);
});

app.post("/register", (req, res) => {


    if ((req.body.email === '') || (req.body.password === '')) {
      res.end("Status Code: 400.  One of your fields was empty");
    } else if (emailExists(req.body.email)) {
      res.end("Status Code: 400. Your email is already registered.");
    } else {
        let shortURL = generateRandomString();
        users[shortURL] = { id: shortURL,
                          email: req.body.email,
                          password: req.body.password
                          }
        console.log(users);
        res.cookie('user_id', shortURL);
        res.redirect('/urls');
    }

});




app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies['user_id']]
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
  let templateVars = { longURL:longURL, shortURL: req.params.id, user: users[req.cookies['user_id']]
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
  console.log (req.cookies);
  let templateVars = { urls: urlDatabase,
    user: users[req.cookies['user_id']]
    };
  console.log(templateVars)
  res.render("urls_index", templateVars);
});

function emailExists(emailAddress) {
for (let userid in users) {
  if (users[userid].email === emailAddress) {
  return true;}
}
  return false;
}


var loggedIn = {};

app.post("/login", (req, res) => {
  let attempLogIn = undefined;
  for (let userid in users) {
  if (users[userid].email === req.body.email) {
  attemptLogIn = users[userid]
  }
}
console.log(attemptLogIn.password, req.body.password);
if(!attemptLogIn) {
  console.log('no email')
  res.status(403).send("Incorrect Login")
}
else if (attemptLogIn.password === req.body.password) {
  console.log('logged in')
  res.cookie('username', req.body.username);
  // let logInName = req.body.username;
  // loggedIn['UserID'] = logInName;
  // console.log(loggedIn);
  res.redirect("/urls");
  }
else {
  console.log('bad pw')
  res.status(403).send("Incorrect Login")
}
});

app.get("/login", (req, res) => {
  let templateVars = { user: users[req.cookies['user_id']]
  };
  res.render("urls_login", templateVars);
});




app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

