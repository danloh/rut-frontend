import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import titleMixin from './util/title'
import * as filters from './util/filters'

// import/use UI component, mix element + vuetify
// vuetify
import Vuetify, {
  VApp, // required
  VForm,
  VTextField,
  VTextarea
} from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify, {
  components: {
    VApp,
    VForm,
    VTextField,
    VTextarea
  }
})
// element
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)
import {
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonGroup,
  Select,
  Option,
  Message
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message

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
