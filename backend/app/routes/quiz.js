const express = require('express');


const router = express.Router();
const shortid = require('shortid');
const crypto = require('crypto');
const Quiz = require('../database/models/quizzes');
const Question = require('../database/models/questions');
const Option = require('../database/models/options');
const QuizSession = require('../database/models/quizSession');
const Session = require('../database/models/sessions');
const isAuthorized = require('./utils/authorized');


const serverError = (err, res) => {
  res.status(500).send('Something went wrong, try again later.');
};

const missingData = (res) => {
  res.status(400).send('Something is missing.');
};

// Where quiz creation happens

router.post('/create', async (req, res) => {
  const loggedIn = await isAuthorized(req);

  if (!loggedIn) {
    res.status(403).send('You need to login to create a quiz.');
    return;
  }

  const { title, description, questions } = req.body;

  if (!title || !description || !questions) {
    missingData(res);
    return;
  }

  const maxQuestions = 30;
  const maxOptions = 4;

  if (questions.length > maxQuestions) {
    res.status(400).send('Too many questions.');
    return;
  }

  if (questions.some((q) => q.options.length > maxOptions)) {
    res.status(400).send('Too many options in one of the questions.');
    return;
  }

  const quizId = shortid.generate();

  // Create the main Quiz
  try {
    console.log('creating quiz');
    await Quiz.create({
      id: quizId,
      title,
      description,
      user_id: req.session.userId,
    });
  } catch (err) {
    serverError(err, res);
    return;
  }

  // Preparing questions for bulkCreate
  const questionsDbReady = questions.map(({ question }) => ({
    question,
    quiz_id: quizId,
  }));


  let questionsDb;

  try {
    questionsDb = await Question.bulkCreate(questionsDbReady, {
      returned: true,
    });
  } catch (err) {
    serverError(err, res);
    return;
  }

  // Looping through questions and add the options
  questionsDb.forEach((question, i) => {
    const { options } = questions[i];
    const optionsDbReady = options.map((option) => ({
      option: option.option,
      is_correct: option.correct,
      question_id: question.id,
      quiz_id: quizId,
    }));

    Option.bulkCreate(optionsDbReady).catch((e) => console.log(e));

    // Once done with no errors we're good to go
    if (i + 1 === questionsDb.length) {
      res.status(201).send({ id: quizId });
    }
  });
});

router.get('/quiz', async (req, res) => {
  const { quizId } = req.query;

  // Quiz name and desc
  let quiz;
  try {
    quiz = await Quiz.findOne({ where: { id: quizId } });
  } catch (err) {
    serverError(err, res);
    return;
  }

  // Questions
  let questions;
  try {
    questions = await Question.findAll({ where: { quiz_id: quizId } });
  } catch (err) {
    serverError(err, res);
    return;
  }

  // Options
  let options;

  try {
    options = await Option.findAll({ where: { quiz_id: quizId } });
  } catch (err) {
    serverError(err, res);
    return;
  }
  const questionsObject = questions.map((q) => ({
    question: q.question,
    options: options.filter((o) => o.question_id === q.id).map((o) => o.option),
  }));

  const clientQuizPackage = {
    title: quiz.title,
    desc: quiz.description,
    questions: questionsObject,
  };

  res.status(201).send(clientQuizPackage);
});

router.post('/quiz-session', async (req, res) => {
  const { quizId } = req.body;
  const session = await QuizSession.findOne({
    where: {
      quiz_id: quizId,
      user_id: req.session.userId,
    },
  });
  if (session) {
    req.app.io.join(session.id);
    res.status(201).send(session.id);
  } else {
    const sessionId = crypto.randomBytes(25).toString('hex');
    QuizSession.create({
      id: sessionId,
      time: 0,
      wrong: 0,
      right: 0,
      amount_of_questions: 0,
      finished: false,
      quiz_id: quizId,
      user_id: req.session.userId,
    }).catch((e) => { console.log(e); res.status(500).send('unknown error'); });

    res.status(201).send(sessionId);
  }
});


module.exports = router;
