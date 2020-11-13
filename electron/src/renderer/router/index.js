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
    // {
    //   path: '/',
    //   name: 'login',
    //   component: require('@/view/login').default,
    // },
    {
      path: '/',
      name: 'manage',
      component: require('@/view/manage').default,
    },
    // {
    //   path: '*',
    //   redirect: '/login',
    // },
  ],
});
