import { createRouter, createWebHashHistory } from 'vue-router'
import AvtorizationView from '../views/AvtorizationView.vue'

const routes = [
  {
    path: '/',
    name: 'avtorization',
    component: AvtorizationView
  },
  {
    path: '/home',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/HomeView.vue'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "about" */ '../views/SetTasksView.vue')
      },
      {
        path: 'my-tasks',
        component: () => import(/* webpackChunkName: "about" */ '../views/MyTasksView.vue')
      },
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "about" */ '../views/UsersView.vue')
      },
      {
        path: 'news',
        component: () => import(/* webpackChunkName: "about" */ '../views/NewsView.vue')
      },
      {
        path: 'admin-page',
        component: () => import(/* webpackChunkName: "about" */ '../views/AdminPageView.vue')
      },
    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
