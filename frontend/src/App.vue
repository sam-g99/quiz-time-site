<template>
  <div id="App">
    <Navigation />
    <router-view></router-view>
    <MobileNav />
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';
import MobileNav from '@/components/MobileNav.vue';

export default {
  name: 'App',
  components: { Navigation, MobileNav },
  watch: {
    $route() {
      const loggedIn = localStorage.getItem('loggedIn');
      const username = localStorage.getItem('username');
      if (loggedIn) {
        console.log('checked auth');
        this.isAuth();
      }
    },
  },
  mounted() {
    const { loggedIn } = this.$store.state;
    if (loggedIn) {
      this.isAuth();
    }
  },
  methods: {
    isAuth() {
      this.axios
        .post(`${this.$store.state.api}/user/logged-in`)
        .then(loggedIn => {
          if (!loggedIn.data) {
            this.$store.commit('auth', {
              bool: false,
              username: '',
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/main.scss';
</style>
