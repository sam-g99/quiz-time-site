<template>
  <div
    v-if="$route.name !== 'register' && $route.name !== 'login'"
    class="mobile-nav-bar"
  >
    {{ $route.name }}
    <div class="links">
      <router-link to="/"> Quizzes </router-link>
      <router-link to="/"> Quiz Creator </router-link>
    </div>
    <div v-if="showLinks" ref="accountLinks" class="account-links">
      <router-link to="login">Login</router-link>
      <router-link to="login">Register</router-link>
    </div>
    <button ref="accountButton" class="account" @click="toggleLinks">
      Account
    </button>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      showLinks: false,
    };
  },
  methods: {
    toggleLinks() {
      console.log('ran');
      this.showLinks = !this.showLinks;
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.mobile-nav-bar {
  display: flex;
  margin: 0 auto;
  margin-top: 10px;
  align-items: center;
  padding: 20px;
  position: fixed;
  bottom: 0;
  background-color: #2a4671;
  width: 100%;
  left: 0;

  @include breakpoint(900) {
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
  button {
    border: none;
    padding: 5px;
    margin-left: auto;
  }

  .account-links {
    margin-left: auto;
    position: fixed;
    bottom: 80px;
    right: 10px;
    a {
      display: inline-block;
      background: white;
      color: $background;
      padding: 7px;
      border-radius: 5px;
      padding-left: 15px;
      padding-right: 15px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
      }
    }
  }
}
img {
  width: 100%;
  max-width: 150px;
}
</style>
