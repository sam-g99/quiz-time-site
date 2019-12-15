<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ desc }}</p>
    <div v-for="(question, index) in questions" :key="index" class="question">
      <a :name="index"></a>
      <h3>Question {{ index + 1 }}</h3>
      <h4>{{ question.question }}</h4>
      <div v-for="(option, qIndex) in question.options" :key="qindex">
        <input
          :id="`${index}${qIndex}`"
          :name="index"
          :value="option"
          type="radio"
        />
        <label :for="`${index}${qIndex}`"> {{ option }} </label>
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
      questions: [],
      socket: io('http://192.168.1.2:3001'),
    };
  },
  mounted() {
    // this.axios
    //   .get(`${this.$store.state.api}/quiz/quiz`, {
    //     params: {
    //       quizId: this.$route.params.id,
    //     },
    //   })
    //   .then(quiz => {
    //     const { title, desc, questions } = quiz.data;
    //     console.log(quiz.data);
    //     this.title = title;
    //     this.desc = desc;
    //     this.questions = questions;
    //   });
    this.socket.emit('quizTime', this.$route.params.id);
    this.socket.on('quiz', quiz => {
      const { title, desc, questions } = quiz;
      console.log(quiz);
      this.title = title;
      this.desc = desc;
    });
  },
};
</script>

<style lang="scss" scoped></style>
