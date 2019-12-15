require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const slowDown = require('express-slow-down');

const app = express(); // Define express app
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sharedsession = require('express-socket.io-session');
const { server } = require('./config');
const database = require('./database');

app.io = io;
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 120,
  delayMs: 500,
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
      scriptSrc: ["'self'"],
      reportUri: '/report-violation',
      objectSrc: ["'self'"],
      upgradeInsecureRequests: true,
    },
  },
  referrerPolicy: { policy: 'same-origin' },
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(speedLimiter);
app.use(limiter);
app.use(cookieParser());
const session = expressSession({
  secret: process.env.SESSION_SECRET,
  key: 'user_session',
  cookie: {
    secureProxy: true,
    httpOnly: true,
    // domain: '',
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },

  saveUninitialized: true,
  resave: false,
});


app.use(session);

io.use(sharedsession(session));

require('./routes/quizSocket.js')(io);

app.use(
  cors({
    origin: ['http://192.168.1.2:8080'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(morgan('combined'));


app.get('/', (req, res) => {
  res.status(201).send('Quiz Time API.');
});

app.use('/user', require('./routes/user'));
app.use('/quiz', require('./routes/quiz'));


database.sync().then(() => {
  http.listen(process.env.PORT, () => {
    console.log(`Server started http://192.168.1.2:${process.env.PORT}`);
  });
})
  .catch((error) => console.log(error));
