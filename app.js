const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Load config file
dotenv.config({ path: "config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

//Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Register helper function
const { formatDate, stripTags, truncate, editIcon, select, getUserId } = require("./helpers/hbs");

// Handlebars
app.engine(".hbs", exphbs({ helpers: { formatDate, stripTags, truncate, editIcon, select, getUserId }, defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Session Middleware
/*
For the secret you can use whatever you want,
Resave to "false" is fine in that you don't save a session if nothing is modified
saveUninitialized to don't create a session until something is stored
This middleware has to be above the passport middleware
*/

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set Global Variables
//Note that it being here is important so that is gets registered before any routing can then begin
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes Processing
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

app.listen(process.env.PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));

