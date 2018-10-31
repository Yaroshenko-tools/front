import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import VueClipboard from 'vue-clipboard2'
import router from './router'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)
Vue.use(VueClipboard)

new Vue({
  el: '#app',
  router: router,
  components: {App},
  template: '<App/>'
})
