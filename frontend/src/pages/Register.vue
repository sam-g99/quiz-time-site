<template>
  <div :class="{ visible: loaded }" class="login-page">
    <img id="svg" src="@/assets/logo.svg" alt="quiz time logo" />
    <div v-if="created" class="created">
      You signed up verify your email
    </div>
    <form v-if="!created" @submit.prevent="login">
      <h2>Hey, Register</h2>
      <TextInput
        :required="true"
        type="text"
        placeholder="Username"
        :value="username"
        @input="value => (username = value)"
      />
      <TextInput
        :required="true"
        type="email"
        placeholder="Email"
        :value="email"
        :loadFocus="true"
        @input="value => (email = value)"
      />
      <TextInput
        :required="true"
        type="password"
        placeholder="Password"
        :value="password"
        @input="value => (password = value)"
      />
      <TextInput
        :required="true"
        type="password"
        placeholder="Reenter Password"
        :value="password2"
        @input="value => (password2 = value)"
      />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <router-link to="/" class="without-nav-buttons back-home"
        >Back Home</router-link
      >
      <router-link to="login" class="without-nav-buttons to-register"
        >Login</router-link
      >
      <LoadingButton :loading="loading" text="Register" />
    </form>
  </div>
</template>

<script>
import TextInput from '@/components/TextInput.vue';
import LoadingButton from '@/components/LoadingButton.vue';

export default {
  components: { TextInput, LoadingButton },
  data: () => {
    return {
      loaded: false,
      username: '',
      email: '',
      password: '',
      password2: '',
      errorMessage: '',
      loading: false,
      created: false,
    };
  },
  mounted() {
    // const svgholder = document.getElementById('svg');
    // svgholder.onload = () => {
    //   this.loaded = true;
    // };
    document.fonts.ready.then(() => {
      this.loaded = true;
    });
    // just in case something doesn't load still show the user
    setTimeout(() => {
      this.loaded = true;
    }, 3000);
  },
  methods: {
    login() {
      this.loading = true;
      this.axios
        .post(`${this.$store.state.api}/user/signup`, {
          username: this.username,
          email: this.email,
          password1: this.password,
          password2: this.password2,
        })
        .then(res => {
          const { status } = res;
          if (status === 201) {
            this.created = true;
          }
        })
        .catch(err => {
          if (!err) return;

          console.log(err.response);
          this.loading = false;
          const { status } = err.response;
          if (status === 400) {
            this.errorMessage = 'Wrong email or password';
          } else if (status === 500) {
            this.errorMessage = 'Unknown error, try again later';
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  opacity: 0;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-flow: column;
  @include breakpoint(900) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
img {
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 30px;
  width: 70%;

  @include breakpoint(900) {
    display: none;
  }
}
form {
  display: flex;
  flex-flow: column;
  width: 100%;
  max-width: 600px;

  h2 {
    color: white;
    font-weight: 500;
    font-size: 28px;
    margin-bottom: 5px;
  }
  input {
    margin-top: 10px;
  }

  .back-home {
    background: white;
    position: absolute;
    bottom: 100px;
    left: 20px;
    padding: 10px;
    text-decoration: none;
    border-radius: 2px;
    color: $background;
  }
  .to-register {
    right: 20px;
    min-width: 100px;
    text-align: center;
  }
  .without-nav-buttons {
    background: white;
    position: absolute;
    bottom: 100px;
    padding: 10px;
    text-decoration: none;
    border-radius: 2px;
    color: $background;
    @include breakpoint(900) {
      display: none;
    }
  }
  .error-message {
    background: rgb(255, 127, 127);
    color: rgb(133, 21, 21);
    margin-top: 10px;
    padding: 5px;
    border-radius: 2px;
    font-size: 15px;
    @include breakpoint(400) {
      font-size: 20px;
    }
  }
}
.visible {
  opacity: 1;
}
</style>
