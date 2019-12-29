<template>
  <div>
    <h1>{{ quiz.title }}</h1>
    <p>{{ quiz.desc }}</p>
    <p>Amount:{{ quiz.amount }}</p>
    <p>{{ timeLeft }}</p>
    <div class="question">
      <h3>Question {{ question.number }}</h3>
      <h4>{{ question.text }}</h4>
      <div
        v-for="option in question.options"
        :key="option.id"
        :class="{ right: right, wrong: wrong }"
      >
        <input
          :id="option.id"
          name="test"
          :disabled="answerPending"
          :value="option.option"
          type="radio"
          @click="submitAnswer"
        />
        <label :for="option.id"> {{ option.option }} </label>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data: () => {
    return {
      quiz: {},
      title: '',
      desc: '',
      question: {},
      mode: 'single',
      amount: 0,
      right: null,
      wrong: null,
      socket: io('http://192.168.1.7:3001'),
      timeLeft: 0,
      answerPending: false,
    };
  },
  mounted() {
    this.socket.emit('quizTime', {
      id: this.$route.params.id,
      mode: this.mode,
    });

    this.socket.on('quiz', data => {
      console.log(data);
      this.quiz = data.info;
      this.question = data.question;
    });

    this.socket.on('question', question => {
      this.question = question;
      this.right = null;
      this.wrong = null;
      this.answerPending = false;
    });

    this.socket.on('timer', timer => {
      this.timeLeft = timer;
    });
    this.socket.on('done', () => {
      alert('You are done!');
    });
    this.socket.on('result', isCorrect => {
      if (isCorrect) {
        this.right = true;
      } else {
        this.wrong = true;
      }
    });
  },
  methods: {
    submitAnswer(e) {
      this.answerPending = true;
      this.socket.emit('answer', parseInt(e.target.id, 10));
    },
  },
};
</script>

<style lang="scss" scoped>
.right {
  background: green;
}

.wrong {
  background: red;
}
</style>
