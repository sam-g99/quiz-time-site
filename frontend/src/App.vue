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
      this.isAuth();
    },
  },
  mounted() {
    this.isAuth();
  },
  methods: {
    isAuth() {
      this.axios
        .post(`${this.$store.state.api}/user/logged-in`)
        .then(loggedIn => {
          console.log(loggedIn);
          if (!loggedIn.data) {
            this.$store.commit('auth', {
              bool: false,
              username: '',
            });
            console.log('auth rejected');
          } else {
            this.$store.commit('auth', {
              bool: true,
              username: '',
            });
            console.log('auth accepted');
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/main.scss';
</style>
