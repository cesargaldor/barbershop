import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/tailwind.css'
//import firebase from 'firebase';

import { firestorePlugin } from 'vuefire'
import { auth } from "./config/firebase.js";
Vue.use(firestorePlugin)

Vue.config.productionTip = false

auth.onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})

