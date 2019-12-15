const crypto = require('crypto');
const Quiz = require('../database/models/quizzes');
const Question = require('../database/models/questions');
const Option = require('../database/models/options');
const QuizSession = require('../database/models/quizSession');
const QuizSessionQuestion = require('../database/models/quizSessionQuestions');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log('connected');
    const { userId, takingQuiz } = socket.handshake.session;
    socket.on('quizTime', async (quizId) => {
      console.log('quiz time hit');
      if (userId) {
        console.log('awesome sauce this user is logged in');
      } else if (takingQuiz) {
        console.log('this user is still taking a quiz');
      } else {
        // eslint-disable-next-line no-param-reassign
        // Quiz name and desc

        const quiz = await Quiz.findOne({ where: { id: quizId } });


        // Questions


        const questions = await Question.findAll({ where: { quiz_id: quizId } });


        // Options

        const options = await Option.findAll({ where: { quiz_id: quizId } });

        const questionsObject = questions.map((q) => ({
          question: q.question,
          options: options.filter((o) => o.question_id === q.id),
        }));

        const clientQuizPackage = {
          title: quiz.title,
          desc: quiz.description,
          test: questionsObject,
        };
        socket.handshake.session.questions = questionsObject;
        console.log(socket.handshake.session.questions);
        if (quiz) {
          socket.handshake.session.takingQuiz = true;
          socket.handshake.session.save();
          console.log(takingQuiz);
        }
        socket.emit('quiz', clientQuizPackage);
        const quizSession = crypto.randomBytes(22).toString('hex');
        console.log('quiz-session', quizSession);
      }
    });
  });
};
