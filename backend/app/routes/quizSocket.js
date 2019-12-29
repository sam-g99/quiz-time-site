// const crypto = require('crypto');
const shortid = require('shortid');
const { getQuiz } = require('./utils/getQuiz');
// const QuizSession = require('../database/models/quizSession');
// const QuizSessionQuestion = require('../database/models/quizSessionQuestions');

const quizError = (quiz) => {
  const notFound = 404;
  if (quiz === notFound || !quiz) {
    return true;
  }
  return false;
};


module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log('connected');


    socket.on('quizTime', async (req) => {
      const { id, mode } = req;
      if (!shortid.isValid(id)) {
        console.log('Invalid quiz id');
        return;
      }

      const modes = ['single', 'multi'];

      if (!modes.includes(mode)) {
        console.log('invalid mode');
        return;
      }

      const quiz = await getQuiz(id);

      if (quizError(quiz)) {
        console.log('Quiz unavailable.');
        return;
      }

      // Send Quiz
      socket.emit('quiz', quiz.clientPackage);

      let currentQuestionIndex = 0;

      let isLastQuestion = false;
      const coolDown = 700;
      const nextQuestion = () => {
        setTimeout(() => {
          if (isLastQuestion || quiz.data.questions.length === 1) {
            socket.emit('done');
            return;
          }
          const q = quiz.data.questions[currentQuestionIndex += 1];
          const { length } = quiz.data.questions;
          if (length === currentQuestionIndex + 1) {
            isLastQuestion = true;
          }
          q.number = currentQuestionIndex + 1;
          socket.emit('question', q);
          console.log('question sent');
        }, coolDown);
      };

      const correct = (optionId) => quiz.data.answers[currentQuestionIndex].id === optionId;

      const submitAnswer = (optionId) => {
        switch (mode) {
          case 'single': {
            socket.emit('result', correct(optionId));
            nextQuestion();
            break;
          }
          default: {
            console.log('default');
          }
        }
      };

      if (req.mode === 'single') {
        socket.on('answer', (optionId) => {
          submitAnswer(optionId);
        });
        return;
      }


      socket.on('answer', (optionId) => {

      });

      // const { userId, takingQuiz } = socket.handshake.session;
      // socket.handshake.session.questions = questionsObject;
      // console.log(socket.handshake.session.questions);
      // if (quiz) {
      //   socket.handshake.session.takingQuiz = true;
      //   socket.handshake.session.save();
      //   console.log(takingQuiz);
      // }


      // const quizSession = crypto.randomBytes(22).toString('hex');
      // console.log('quiz-session', quizSession);
      // } else if (takingQuiz) {
      //   console.log('this user is still taking a quiz');
      // } else {
      //   console.log('nothing');
      // }
    });
  });
};
