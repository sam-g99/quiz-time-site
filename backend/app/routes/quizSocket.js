const crypto = require('crypto');
const Quiz = require('../database/models/quizzes');
const Question = require('../database/models/questions');
const Option = require('../database/models/options');
// const QuizSession = require('../database/models/quizSession');
// const QuizSessionQuestion = require('../database/models/quizSessionQuestions');


module.exports = (io) => {
  io.on('connection', async (socket) => {
    const serverError = (err) => {
      console.log(err);
      socket.emit('err', 'Something went wrong, try again later.');
    };

    console.log('connected');
    // const { userId, takingQuiz } = socket.handshake.session;

    socket.on('quizTime', async (quizId) => {
      console.log('quiz time hit');
      if (1) {
        // Quiz name and desc
        let quiz;
        try {
          quiz = await Quiz.findOne({ where: { id: quizId } });
        } catch (err) {
          serverError(err);
          return;
        }

        // Questions
        let questions;
        try {
          questions = await Question.findAll({ where: { quiz_id: quizId } });
        } catch (err) {
          serverError(err);
          return;
        }

        // Options
        let options;

        try {
          options = await Option.findAll({ where: { quiz_id: quizId } });
        } catch (err) {
          serverError(err);
          return;
        }

        // Combining questions and their options
        questions = questions.map((q) => ({
          question: { id: q.id, text: q.question },
          options: options.filter((o) => o.question_id === q.id)
            .map((o) => ({ id: o.id, option: o.option })),
        }));

        console.log(questions);
        const clientQuizPackage = {
          title: quiz.title,
          desc: quiz.description,
          question: questions[0],
        };

        // socket.handshake.session.questions = questionsObject;
        // console.log(socket.handshake.session.questions);
        // if (quiz) {
        //   socket.handshake.session.takingQuiz = true;
        //   socket.handshake.session.save();
        //   console.log(takingQuiz);
        // }


        socket.emit('quiz', clientQuizPackage);
        // const quizSession = crypto.randomBytes(22).toString('hex');
        // console.log('quiz-session', quizSession);
        const correct = (optionId) => {
          const query = ({ id }) => id === optionId;
          const option = options.find(query);
          return option.is_correct;
        };

        socket.on('answer', (optionId) => {
          if (correct(optionId)) {
            console.log('Welp they got it right');
          } else {
            console.log('They got it WRONG');
          }
        });
      }
      // } else if (takingQuiz) {
      //   console.log('this user is still taking a quiz');
      // } else {
      //   console.log('nothing');
      // }
    });
  });
};
