const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const mongoDb = process.env.DATABASE_URL;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);

const app = express();
const port = process.env.PORT;
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/login", (req, res) => {
  res.render("login-form", { message: req.flash('error') });
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up-form", { message: req.flash('error') });
});


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect Username!" });
      };
      // Compare hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect Password!" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.post("/sign-up", async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.render('sign-up-form', { message: 'Please populate the missing fields.' });
    }
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });

    const user = new User({
      username: req.body.username,
      password: hashedPassword
    });

    const result = await user.save();
    res.redirect("/");
  } catch(err) {
    return next(err);
  };
});

app.post("/login", (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.render('login-form', { message: 'Please populate the missing fields.' });
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login-form", { message: info.message });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
