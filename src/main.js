import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import titleMixin from './util/title'
import * as filters from './util/filters'

Vue.use(Vuetify)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// mixin title handler
Vue.mixin(titleMixin)

Vue.prototype.$axios = axios
export default axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
