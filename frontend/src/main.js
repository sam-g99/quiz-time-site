import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import moment from 'moment';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/css/layout.css';

Vue.prototype.moment = moment;
Vue.config.productionTip = false;
Vue.use(VueAxios, axios.create({ withCredentials: true }));

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
