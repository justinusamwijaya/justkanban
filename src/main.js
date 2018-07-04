import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueDraggable from 'vue-draggable'
import navbar from './components/navbar.vue'

Vue.use(VueDraggable)

Vue.config.productionTip = false

Vue.component('navbar', navbar)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
