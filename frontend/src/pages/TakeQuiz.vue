<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ desc }}</p>
    <p>{{ timeLeft }}</p>
    <div class="question">
      <h3>Question 1</h3>
      <h4>{{ question.question.text }}</h4>
      <div v-for="option in question.options" :key="option.id">
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
      title: '',
      desc: '',
      question: {},
      socket: io('http://192.168.1.7:3001'),
      timeLeft: 0,
      answerPending: false,
    };
  },
  mounted() {
    this.socket.emit('quizTime', this.$route.params.id);

    this.socket.on('quiz', quiz => {
      const { title, desc, question } = quiz;
      console.log(quiz);
      this.title = title;
      this.desc = desc;
      this.question = question;
    });

    this.socket.on('question', question => {
      const { data } = question;
      this.question = data;
    });

    this.socket.on('timer', timer => {
      this.timeLeft = timer;
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

<style lang="scss" scoped></style>
