// const crypto = require('crypto');
const { getQuiz } = require('./utils/getQuiz');
// const QuizSession = require('../database/models/quizSession');
// const QuizSessionQuestion = require('../database/models/quizSessionQuestions');


module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log('connected');

    socket.on('quizTime', async (quizId) => {
      const quiz = await getQuiz(quizId);
      console.log(quiz);

      if (quiz === 404) {
        socket.emit(404);
        return;
      } if (!quiz) {
        socket.emit('err');
        return;
      }

      socket.emit('quiz', quiz.clientQuizPackage);

      const correct = (optionId) => {
        const query = ({ id }) => id === optionId;
        const option = quiz.data.options.find(query);
        return option.is_correct;
      };
      const nextQuestionTime = 1000;
      const nextQuestion = () => {
        const q = quiz.data.questions[1];
        q.number = 2;
        socket.emit('question', q);
        console.log('question sent');
      };
      socket.on('answer', (optionId) => {
        if (correct(optionId)) {
          console.log('Welp they got it right');
          socket.emit('right');
          setTimeout(nextQuestion, nextQuestionTime);
        } else {
          console.log('They got it WRONG');
          socket.emit('wrong');
          setTimeout(nextQuestion, nextQuestionTime);
        }
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
