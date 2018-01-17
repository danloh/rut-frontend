// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import axios from 'axios'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import ProgressBar from './components/Misc/ProgressBar.vue'
import titleMixin from './util/title'
import * as filters from './util/filters'
import { getToken } from '@/util/auth'
import App from './App'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'

// registers: store.state.route
sync(store, router)

Vue.config.productionTip = false

// element UI + en
// Vue.use(ElementUI, { locale })
locale.use(lang)
import {
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  DatePicker,
  Form,
  FormItem,
  Icon,
  Message
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)

Vue.prototype.$message = Message

// progress bar, reder off-document and append afterwards
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

// mixin title handler
Vue.mixin(titleMixin)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Axios config
// Request interceptor
// axios.interceptors.request.use(
//   config => {
//     let token = getToken()
//     if (token) {
//       config.headers.Authorization = `Basic ${token}`
//     }
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )
// Response interceptor
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.commit('DEL_TOKEN')
          new Vue().$message('Oops...Access Denied, Need To Log in')
          if (router.currentRoute.path !== '/login') {
            router.push({
              path: '/login',
              query: {redirect: router.currentRoute.fullPath}
            })
          }
          break
        case 403:
          new Vue().$message('Oops...Forbidden')
          break
        case 404:
          new Vue().$message('The Resource Was Not Found')
          router.replace({ path: '/404' })
          break
        case 418:
          new Vue().$message('Eureka! 42')
          break
        case 500:
          new Vue().$message('Oops...Error')
          router.replace({ path: '/' })
          break
        default:
          new Vue().$message('Oops...Something Failed: ' + error.response.statusText)
      }
    }
    // console.log(error.response.data)
    return Promise.reject(error)
  }
)

// config router
// check auth when login required( define in meta // need to tackle some issue!!
router.beforeEach((to, from, next) => {
  bar.start()
  if (to.meta.auth) {
    // config axios defaul auth??!!
    let localToken = getToken()
    axios.defaults.auth = {
      username: localToken,
      password: localToken
    }
    if (localToken) {
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // redirect after login
      })
    }
  } else {
    next()
  }
})
// finish bar after route
router.afterEach(() => {
  bar.finish()
})

// register axios as default http client
Vue.prototype.$axios = axios
export default axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
