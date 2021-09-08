 if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}
//Password
// v4TkL5zmU89mIwyT
// process.env.NODE_ENV is an environment variable which is development or prodution, when we deploy we will run our code in production.  We are saying if we are in development take the packages and add them to process.env in the node app.

// console.log(process.env.SECRET)
// console.log(process.env.API_KEY)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
//ejs-mate (one of many) is one of the engines used to parse to make sense of ejs
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
//we need to use method override to Update
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const MongoDBStore = require('connect-mongodb-session')(session);
const { contentSecurityPolicy } = require('helmet');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const db = mongoose.connection; // with this we don't have to reference mongoose.connection below.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
	replaceWith: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
	url: dbUrl,
	secret,
	touchAfter: 24 * 60 * 60 // this has to be in seconds.
	//touchAfter session only updates once every 24 hours, if the data needs to update it will update if the data is the same don't update
});

store.on("error", function (e) {
	console.log("session store error", e)
})

const sessionConfig = {
	store,
	name:'session',// session id when the site sends the cookie it will name the session 'session'.
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		//secure is saying it has to be https, it wont work with http only.
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		// the cookie will expire in a week from now, we have to figure out how many milliseconds are in a week hence the math equation
	maxAge: 1000 * 60 * 60 * 24 * 7
	}
}

app.use(session(sessionConfig))
app.use(flash());
app.use(helmet(contentSecurityPolicy));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
	"https://www.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com/",	
	"https://kit.fontawesome.com",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net/",
	"https://account.mapbox.com/access-tokens/"
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
];

const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://a.titles.mapbox.com/",
	"https://b.titles.mapbox.com/",
	"https://events.mapbox.com/",
];

const fontSrcUrls = []
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/deeq7pxhe/",
				"https://images.unsplash.com/"
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);


app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next();
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500, message = 'something went wrong' } = err;
	if (!err.message) err.message = 'Oh No, Something went wrong';
	res.status(statusCode).render('error', { err });
});

app.listen(4000, () => {
	console.log('Serving on Port 4000');
});
