<template>
  <div>
    <h1>{{ username }}</h1>

    <p v-if="joined">Joined: {{ moment(joined).fromNow() }}</p>

    <div v-if="this.$store.state.loggedIn" class="account-settings">
      <input v-model="email" type="text" />
      <button @click="changeEmail">Change Email</button><br />
      <input v-model="newPassword" type="password" />
      <button @click="changePassword">Change Password</button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      username: '',
      email: '',
      joined: '',
      password: '',
      newPassword: 'password',
    };
  },
  mounted() {
    this.axios
      .get(`${this.$store.state.api}/user/profile`, {
        params: {
          username: this.$route.params.username,
        },
      })
      .then(res => {
        const { username, created, email } = res.data;
        this.username = username;
        this.joined = created;
        this.email = email;
      });
  },
  methods: {
    changeEmail() {
      this.axios
        .post(`${this.$store.state.api}/user/change-email`, {
          password: 'passwossd',
          newEmail: this.email,
        })
        .then(r => console.log(r))
        .catch(e => console.log(e.response));
    },
    changePassword() {
      this.axios
        .post(`${this.$store.state.api}/user/change-password`, {
          oldPassword: 'password',
          newPassword: this.newPassword,
        })
        .then(r => console.log(r))
        .catch(e => console.log(e.response));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/main.scss';
</style>
