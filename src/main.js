import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import titleMixin from './util/title'
import * as filters from './util/filters'

// import/use UI component
import Vuetify, {
  VApp, // required
  VForm,
  VTextField,
  VTextarea,
  VDialog,
  VCard,
  VBtn
} from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify, {
  components: {
    VApp,
    VForm,
    VTextField,
    VTextarea,
    VDialog,
    VCard,
    VBtn
  }
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// mixin title handler
Vue.mixin(titleMixin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
