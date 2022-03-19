const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');

require('dotenv').config();

const authRouter = require('./src/routes/auth.router');
const userRouter = require('./src/routes/users.router');
const apiRouter = require('./src/routes/api.router');

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
app.use('/users', userRouter);
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Start server to PORT = ${PORT}`))
