<template>
  <div class="nav-bar">
    <router-link to="/">
      <img id="svg" src="@/assets/logo.svg" alt="quiz time logo" />
    </router-link>
    <div class="links">
      <router-link to="/"> Quizzes </router-link>
      <router-link to="/create"> Quiz Creator </router-link>
    </div>
    <div class="account-links">
      <router-link v-if="!this.$store.state.loggedIn" to="/login"> Login </router-link>
      <router-link v-if="!this.$store.state.loggedIn" to="/register"> Register </router-link>
      <button v-if="this.$store.state.loggedIn" @click="logout">Log Out</button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      loggedIn: '',
    };
  },
  mounted() {
    this.loggedIn = this.$store.state.loggedIn;
  },
  methods: {
    logout() {
      this.axios.post(`${this.$store.state.api}/user/logout`).then(() => {
        this.$store.commit('auth', {
          bool: false,
          username: '',
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.nav-bar {
  display: flex;
  margin: 0 auto;
  margin-top: 10px;
  align-items: center;
  padding: 20px;

  @include breakpoint-max(900) {
    display: none;
  }

  .links {
    align-self: center;
    margin-left: 15px;
    a {
      color: white;
      font-weight: 500;
      font-size: 18px;
      @include horizontal-spacing(20px);
    }
  }

  .account-links {
    margin-left: auto;
    a {
      display: inline-block;
      background: white;
      color: $background;
      padding: 7px;
      border-radius: 5px;
      padding-left: 15px;
      padding-right: 15px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      transition: box-shadow 0.2s;
      @include horizontal-spacing(10px);

      &:first-of-type {
        background: $backgroundLighter;
        color: white;
      }

      &:hover {
        transform: scale(1.03);
      }
      &:active {
        transform: scale(1);
        box-shadow: none;
      }
    }
  }
}
img {
  width: 100%;
  max-width: 150px;
}
</style>
