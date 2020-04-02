import Vue from 'vue'
import App from './App.vue'
import VueClipboard from 'vue-clipboard2'
import router from './router'
import vuetify from './plugins/vuetify'
import './campaignBuilder'
import 'babel-polyfill'

Vue.use(VueClipboard)

new Vue({
  el: '#app',
  vuetify: vuetify,
  router: router,
  render: h => h(App),
});
