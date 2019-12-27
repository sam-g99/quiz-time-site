const Quiz = require('../../database/models/quizzes');
const Question = require('../../database/models/questions');
const Option = require('../../database/models/options');


module.exports.getQuiz = async (id) => {
  // Quiz name and desc
  let quiz;

  try {
    quiz = await Quiz.findOne({ where: { id } });
  } catch (err) {
    console.log(err);
    return false;
  }
  if (!quiz) {
    return 404; // Not Found
  }
  // Questions
  let questions;
  try {
    questions = await Question.findAll({ where: { quiz_id: id } });
  } catch (err) {
    console.log(err);
    return false;
  }

  // Options
  let options;

  try {
    options = await Option.findAll({ where: { quiz_id: id } });
  } catch (err) {
    console.log(err);
    return false;
  }

  // Combining questions and their options
  questions = questions.map((q) => ({
    id: q.id,
    text: q.question,
    options: options.filter((o) => o.question_id === q.id)
      .map((o) => ({ id: o.id, option: o.option })),
  }));

  console.log(questions);
  const data = {
    quiz,
    options,
    questions,
  };

  const questionToSend = questions[0];
  questionToSend.number = 1;

  console.log(questionToSend, 'to send');
  const clientQuizPackage = {
    info: {
      title: quiz.title,
      desc: quiz.description,
      amount: questions.length,
    },
    question: questionToSend,
  };

  return {
    data,
    clientQuizPackage,
  };
};
