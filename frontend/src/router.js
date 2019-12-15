import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import Register from './pages/Register';
import QuizCreator from './pages/QuizCreator';
import TakeQuiz from './pages/TakeQuiz';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/user/:username',
      component: Account,
    },
    {
      path: '/create',
      component: QuizCreator,
    },
    {
      path: '/take/:id',
      component: TakeQuiz,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.fullPath === '/login' || to.fullPath === '/register') {
    const { loggedIn, username } = store.state;
    console.log('route', loggedIn);

    const profilePath = `/user/${username}`;
    if (loggedIn) {
      if (from.path !== profilePath) {
        router.push(profilePath);
      } else {
        next(false);
        return;
      }
    }
  }
  next();
});
export default router;
