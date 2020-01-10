const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const validator = require('email-validator');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../database/models/users');
const Session = require('../database/models/sessions');
const LoginAttempt = require('../database/models/attempts');
const QuizSession = require('../database/models/quizSession');
const QuizSessionQuestion = require('../database/models/quizSessionQuestions');
const isAuthorized = require('./utils/authorized');

console.log(isAuthorized);

const signUpLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5000,
});

const loginLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
});

const serverError = (err, res) => {
  res.status(500).send('Something went wrong, try again later.');
  console.log(err);
};

const mailVerification = async (userEmail, subject, text, html) => {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  const info = await transporter.sendMail({
    from: '"Test Mail" <yayeet@gottem.com>',
    to: `${userEmail}`,
    subject,
    text,
    html,
  });
  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

router.post('/logged-in', async (req, res) => {
  res.status(201).send(await isAuthorized(req));
});

router.post('/signup', signUpLimit, async (req, res) => {
  const {
    username, email, password1, password2,
  } = req.body;
  console.log(req.headers['user-agent']);

  if (!username || !email || !password1 || !password2) {
    res.status(400).send('Something is missing.');
    return;
  }
  const regex = /[^a-z0-9_]/gi;
  const regexTest = username.replace(regex, '');

  if (username !== regexTest) {
    res.status(400).send('Username has invalid characters');
    return;
  }

  if (username.length > 16) {
    res.status(400).send('Username is too long');
    return;
  }

  if (username.length < 3) {
    res.status(400).send('Username is too short');
    return;
  }

  if (password1 !== password2) {
    res.status(400).send('Passwords do not match');
    return;
  }

  if (!validator.validate(email)) {
    res.status(400).send('Email is not valid');
    return;
  }

  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password1, 12, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });

  const usernameExist = await User.findOne({ where: { username } });
  if (usernameExist !== null) {
    res.status(409).send('Username already exist.');
    return;
  }

  const emailInUse = await User.findOne({ where: { email } });
  if (emailInUse !== null) {
    res.status(409).send('Email is in use.');
    return;
  }

  const verificationCode = uuidv4();

  User.create({
    username,
    password: encryptedPassword,
    email,
    verified: false,
    verification: verificationCode,
    signUpIp: req.ip,
    created: new Date(),
  })
    .then(() => {
      const html = `<a href="http://${req.app.get('localAddress')}:${process.env.PORT}/user/verify?code=${verificationCode}" target="_blank">Click here</a>`;
      mailVerification(email, 'Verification', 'oop', html);
      res.status(201).send('User created');
    })

    .catch((error) => {
      console.log(error);
      res.status(500).send('Unknown error, try again later.');
    });
});

router.get('/verify', async (req, res) => {
  const uuid = req.query.code;
  if (!uuid) {
    res.send('error');
  }
  User.findOne({ where: { verification: uuid } })
    .then((user) => {
      if (user) {
        user.update({ verified: true, verification: null });
        res.status(201).send('You did it. You\'re verified');
      } else {
        res.status(400).send('link expired or never existed');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Something went wrong, try again later.');
    });
});

const logAttempt = (req, failed) => {
  LoginAttempt.create({
    date: new Date(),
    failed,
    user_agent: req.headers['user-agent'],
    request_ip: req.ip,
    user_email: req.body.email,
  })
    .catch((err) => { console.log(err); });
};

router.post('/login', loginLimit, async (req, res) => {
  const loggedIn = await isAuthorized(req);
  if (loggedIn) {
    res.status(201).send({ message: 'You\'re already logged in!' });
    return;
  }

  const { email, password, stay } = req.body;

  if (!email || !password) {
    res.status(400).send('Something is missing.');
    return;
  }

  if (!validator.validate(email)) {
    res.status(400).send('Email is not valid');
    return;
  }

  const genericMessage = 'Please make sure your email and password are correct.';

  User.findOne({ where: { email } })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password)
          .then((result) => {
            if (result) {
              logAttempt(req, false);
              req.session.userId = user.id;
              const loginSessionCode = crypto.randomBytes(180).toString('hex');
              if (stay) {
                // 30 days
                res.cookie('login_secret', loginSessionCode, { maxAge: 2592000000, httpOnly: true });
                Session.create({
                  device: req.headers['user-agent'],
                  cookie: loginSessionCode,
                  date: new Date(),
                  user_id: user.id,
                }).catch((err) => {
                  console.log(err);
                  res.status(500).send('Something went wrong, try again later.');
                });
              }
              res.status(201).send({ message: 'You\'re now logged in', username: user.username });
            } else {
              logAttempt(req, true);
              res.status(400).send(genericMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send('Something went wrong, try again later');
          });
      } else {
        res.status(400).send(genericMessage);
      }
    });
});

router.post('/logout', async (req, res) => {
  req.session.destroy();
  const loginCookie = req.cookies.login_secret;
  if (loginCookie) {
    Session.destroy({ where: { cookie: loginCookie } });
  }
  res.clearCookie('login_secret');
  res.clearCookie('user_session');

  res.status(201).send('You are logged out');
});

router.post('/change-email', async (req, res) => {
  const loggedIn = await isAuthorized(req);
  if (!loggedIn) {
    res.status(403).send('You\'re not logged in');
    return;
  }

  const { password, newEmail } = req.body;

  if (!password || !newEmail) {
    res.status(400).send('Something is missing');
    return;
  }

  if (!validator.validate(newEmail)) {
    res.status(400).send('Email is not valid');
    return;
  }

  User.findOne({ where: { id: req.session.userId } })
    .then((user) => {
      if (user) {
        if (user.email === newEmail) {
          res.status(400).send('That email is already associated with your account.');
        }

        bcrypt.compare(password, user.password)
          .then((result) => {
            if (result) {
              const verificationCode = uuidv4();
              const html = `<a href="http://192.168.1.3:3001/user/verify?code=${verificationCode}" target="_blank">Click here</a>`;
              mailVerification(newEmail, 'Verification', 'oop', html);
              user.update({ email: newEmail, verified: false, verification: verificationCode });
              res.status(201).send('Your email has been updated, please verify the new email');
            } else {
              res.status(403).send('Wrong password.');
            }
          })
          .catch((err) => {
            res.status(500).send('Something went wrong, try again later.');
            console.log(err);
          });
      }
    });
});

router.post('/change-password', async (req, res) => {
  const loggedIn = await isAuthorized(req);
  if (!loggedIn) {
    res.status(403).send('You\'re not logged in.');
    return;
  }
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400).send('Something is missing.');
    return;
  }

  if (oldPassword === newPassword) {
    res.status(400).send('Passwords submitted are the same');
    return;
  }
  User.findOne({ where: { id: req.session.userId } })
    .then((user) => {
      if (user) {
        bcrypt.compare(oldPassword, user.password)
          .then(async (result) => {
            if (result) {
              const encryptedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(newPassword, 12, (err, hash) => {
                  if (err) reject(err);
                  resolve(hash);
                });
              });
              user.update({ password: encryptedPassword });
              res.status(201).send('Password updated');
            } else {
              res.status(403).send('Wrong current password.');
            }
          })
          .catch((err) => { serverError(err, res); });
      }
    })
    .catch((err) => console.log(err));
});

router.post('/delete-account', async (req, res) => {
  const loggedIn = await isAuthorized(req);
  if (!loggedIn) {
    res.status(201).send('You\'re not logged in.');
    return;
  }

  const { password } = req.body;

  if (!password) {
    res.status(400).send('Password was not entered.');
  }

  User.findOne({ where: { id: req.session.userId } })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password)
          .then((result) => {
            if (result) {
              User.destroy({ where: { id: req.session.userId } });
              res.session.destroy();
              res.status(201).send('Your account was successfully deleted.');
            } else {
              res.status(400).send('Password incorrect.');
            }
          })
          .catch((err) => { serverError(err, res); });
      } else {
        serverError(null, res);
      }
    })
    .catch((err) => { serverError(err, res); });
});

const getUnfinishedQuizzes = async (userId) => {
  const unfinishedQuizzes = await QuizSession.findAll({
    where: {
      user_id: userId,
      finished: false,
    },
  });
  const clientReady = unfinishedQuizzes.map((q) => ({
    title: q.title,
    time: q.time,
    wrong: q.wrong,
    right: q.right,
    amount: q.amount_of_questions,
  }));
  return clientReady;
};

router.get('/profile', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    res.status(400).send('Something is missing.');
  }

  User.findOne({ where: { username } })
    .then((user) => {
      if (user) {
        const { created, email, id } = user;
        const dataToSend = { username: user.username, created };

        if (id === req.session.userId) {
          dataToSend.email = email;
          dataToSend.currentUser = true;
        }

        res.status(201).send(dataToSend);
      } else {
        res.status(404).send('User does not exist.');
      }
    });
});


module.exports = router;
