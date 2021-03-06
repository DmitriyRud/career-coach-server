const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');

require('dotenv').config();

const authRouter = require('./src/routes/auth.router');
const usersRouter = require('./src/routes/users.router');
const helperRouter = require('./src/routes/helper.router');
const userRouter = require('./src/routes/user.router');
const apiRouter = require('./src/routes/api.router');
const scrapRouter = require('./src/routes/scrap.router');
const recomRouter = require('./src/routes/recom.router');
const vacansiesRouter = require('./src/routes/vacansies.router');


const app = express();
const { COOKIE_SECRET, COOKIE_NAME } = process.env;

// SERVER'S SETTINGS
app.set('cookieName', COOKIE_NAME);

// APP'S MIDDLEWARES
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(
  session({
    name: app.get('cookieName'),
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1e3 * 86400, // COOKIE'S LIFETIME — 1 DAY
    },
  }),
);

// APP'S ROUTES
app.use('/auth', authRouter);

app.use('/helper', helperRouter);
app.use('/users/profile', userRouter)
app.use('/api', apiRouter);
app.use('/scrap', scrapRouter);
app.use('/users', usersRouter);
app.use('/recommend', recomRouter);
app.use('/bestvacansies', vacansiesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Start server to PORT = ${PORT}`))
