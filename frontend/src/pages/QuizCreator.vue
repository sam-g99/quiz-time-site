<template>
  <div class="creator-container">
    <form @submit.prevent="createQuiz">
      <div class="name-desc">
        <label for="qName"> Quiz name </label>
        <input
          id="qName"
          v-model="name"
          type="text"
          placeholder="Enter quiz name"
        />
        <label for="desc"> Description </label>
        <input
          id="desc"
          v-model="desc"
          type="text"
          placeholder="Enter short description"
        />
      </div>
      <div class="section-cut">
        <p>Your questions</p>
      </div>
      <div class="question-anchors">
        <a
          v-for="(question, index) in questions"
          :key="index"
          :href="`#${index}`"
        >
          {{ index + 1 }}
        </a>
      </div>
      <div v-for="(question, index) in questions" :key="index" class="question">
        <button class="delete" type="button" @click="deleteQuestion(index)">
          Delete Question
        </button>
        <a :name="index"></a>
        <h3>Question {{ index + 1 }}</h3>
        <input
          v-model="question.question"
          type="text"
          placeholder="Enter Question"
        />
        <div v-for="(option, oIndex) in question.options" :key="oIndex">
          <input
            v-model="question.options[oIndex].option"
            type="text"
            :placeholder="`option ${oIndex + 1}`"
          />
          <button
            v-if="question.options.length > 2"
            type="button"
            @click="deleteOption(index, oIndex)"
          >
            Delete Option
          </button>
          <button
            :class="{ answer: option.correct }"
            type="button"
            @click="setAnswer(index, oIndex)"
          >
            Set as answer
          </button>
        </div>
        <button
          v-if="question.options.length < 4"
          type="button"
          @click="addOption(index)"
        >
          Add Option
        </button>
      </div>
      <br />
      <button type="button" @click="addQuestion">New Question</button>
      <button type="submit">Create Quiz</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      max: {
        questions: 30,
        options: 4,
      },
      name: '',
      desc: '',
      questions: [
        {
          question: '',
          options: [
            { option: '', correct: false },
            { option: '', correct: false },
          ],
        },
      ],
    };
  },
  methods: {
    addQuestion() {
      if (this.questions.length < this.max.questions) {
        this.questions.push({
          question: '',
          options: [
            { option: '', correct: false },
            { option: '', correct: false },
          ],
        });
      }
    },
    deleteQuestion(qIndex) {
      if (this.questions.length > 1) {
        this.questions.splice(qIndex, 1);
      }
    },
    addOption(index) {
      const { options } = this.questions[index];
      if (options.length < this.max.options) {
        options.push({ option: '', correct: false });
      }
    },
    deleteOption(qIndex, oIndex) {
      const { options } = this.questions[qIndex];
      if (options.length > 2) {
        options.splice(oIndex, 1);
      }
    },

    setAnswer(qIndex, oIndex) {
      const { options } = this.questions[qIndex];
      if (options[oIndex].option === '') {
        return;
      }
      options.forEach((o, i) => {
        if (i === oIndex) {
          options[i].correct = true;
        } else {
          options[i].correct = false;
        }
      });
    },
    createQuiz() {
      if (!this.name) {
        alert('Please name this quiz.');
        return;
      }
      if (!this.desc) {
        alert('Enter a description for your quiz.');
        return;
      }

      this.questions.forEach((q, i) => {
        if (!q.question) {
          alert(`Please enter a question for question ${i + 1}`);
        }
        const checkIfOptionEmpty = ({ option }) => option.trim() === '';
        if (q.options.some(checkIfOptionEmpty)) {
          alert(`Please enter missing option in question ${i + 1}`);
          return;
        }
        const checkIfAnswerSet = ({ correct }) => correct === true;

        if (!q.options.some(checkIfAnswerSet)) {
          alert(`Please set answer for question ${i + 1}`);
        }
      });
      this.axios
        .post(`${this.$store.state.api}/quiz/create`, {
          title: this.name,
          description: this.desc,
          questions: this.questions,
        })
        .then(res => {
          console.log(res.data);
          this.$router.push(`/take/${res.data.id}`);
        })
        .catch(e => console.log(e.response));
    },
  },
};
</script>

<style lang="scss" scoped>
.question-anchors {
  display: flex;
  a {
    display: inline-block;
    color: white;
    font-weight: bold;
    @include horizontal-spacing(10px);
  }
}
form {
  display: flex;
  flex-flow: column;
  max-width: 500px;
  width: 100%;
  .question {
    display: flex;
    flex-flow: column;
  }
}

.creator-container {
  height: 100%;
  padding-bottom: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

input {
  width: 100%;
  padding: 5px;
  border: none;
  outline: none;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
}

button {
  border: none;
  padding: 5px;
  outline: none;
}
.delete {
  background: rgb(255, 98, 98);
  color: rgb(126, 0, 0);
  font-weight: 800;
}
.answer {
  background-color: green;
}

.name-desc {
  label {
    color: white;
    display: block;
    margin-bottom: 5px;
    margin-top: 10px;

    &:first-child {
      font-size: 22px;
    }
  }
  input {
    margin: 0;
  }
}

h3 {
  color: white;
  font-weight: 400;
  margin-bottom: 10px;
  margin-top: 10px;
}
.section-cut {
  background: #3660a3;
  display: block;
  width: 100%;
  padding: 5px;
  color: white;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
