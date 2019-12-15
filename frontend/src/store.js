import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'quiz-time',
  storage: window.localStorage,
});

const store = new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    api: 'http://192.168.1.2:3001',
    loggedIn: false,
    username: '',
  },
  mutations: {
    auth(state, value) {
      // eslint-disable-next-line no-param-reassign
      state.loggedIn = value.bool;
      state.username = value.username;
    },
  },
});

export default store;
