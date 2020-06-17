import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { auth } from "../config/firebase.js";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,

  },
  {
    path: '/citas',
    name: 'Citas',
    component: () => import('../views/Citas.vue'),

  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: {
      requiresAuth: true
    }

  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      ignoresAuth: true
    }
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const ignorarRegistrado = to.matched.some(record => record.meta.ignoresAuth);

  if (requiresAuth && !currentUser) {
    next("login");
  } else if (currentUser && ignorarRegistrado) {
    next("admin");
  } else {
    next();
  }


});


export default router
