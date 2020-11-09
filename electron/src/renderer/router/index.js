import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/App').default,
    // },
    {
      path: '/',
      name: 'login',
      component: require('@/view/login').default,
    },
    // {
    //   path: '/test',
    //   name: 'test',
    //   component: require('@/view/test').default,
    // },
    {
      path: '*',
      redirect: '/login',
    },
  ],
});
