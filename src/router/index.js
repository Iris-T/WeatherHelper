import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CityView from '../views/CityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: "主页",
      },
    },
    {
      path: '/weather/:place:place_name',
      name: 'cityView',
      component: CityView,
      meta: {
        title: "天气",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = `小助手-${ 
    to.params.place_name
    ? `${to.params.place}`
    : to.meta.title}`;
  next();
})

export default router
