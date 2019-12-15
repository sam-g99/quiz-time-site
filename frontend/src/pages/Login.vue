<template>
  <div :class="{ visible: loaded }" class="login-page">
    <img id="svg" src="@/assets/logo.svg" alt="quiz time logo" />
    <form @submit.prevent="login">
      <h2>Hey, login</h2>
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
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <router-link to="/" class="without-nav-buttons back-home"
        >Back Home</router-link
      >
      <router-link to="register" class="without-nav-buttons to-register"
        >Register</router-link
      >
      <div>
        <input id="stay" v-model="stay" type="checkbox" name="stay" />
        <label for="stay"> Stay logged in</label>
      </div>
      <LoadingButton :loading="loading" text="Login" />
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
      email: '',
      password: '',
      errorMessage: '',
      loading: false,
      stay: false,
    };
  },
  mounted() {
    // const svgholder = document.getElementById('svg');
    // svgholder.onload = () => {
    //   this.loaded = true;
    // };
    console.log(this.$store.state.username);
    console.log(this.$store.state.loggedIn);
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
        .post(`${this.$store.state.api}/user/login`, {
          email: this.email,
          password: this.password,
          stay: this.stay,
        })
        .then(res => {
          this.loading = false;
          console.log('loggedIn', this.$store.state.loggedIn);
          this.$store.commit('auth', {
            bool: true,
            username: res.data.username,
          });
          this.$router.push(`user/${res.data.username}`);
          console.log(res.data);
        })
        .catch(err => {
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
  display: flex;
  flex-flow: column;
  opacity: 0;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  @include breakpoint(900) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
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
