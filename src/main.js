import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/tailwind.css'


import { firestorePlugin } from 'vuefire'
import '../firebase.js';
Vue.use(firestorePlugin)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')