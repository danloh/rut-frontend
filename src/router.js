import Vue from 'vue'
import Router from 'vue-router'

// import components, lazy loading, code splitting
const Home = () => import('./views/Home')
// const ProgressBar = () => import('./components/Misc/ProgressBar')
const Register = () => import('./components/Auth/Register.vue')
const Login = () => import('./components/Auth/Login.vue')
const RutView = () => import('./views/RutView')
const NewRut = () => import('./components/Rut/NewRut')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/register', component: Register, name: 'Register' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/r/:id', name: 'Rutview', component: RutView },
    { path: '/new', name: 'NewRut', component: NewRut, meta: {auth: true} }
  ]
})

// progress bar, reder off-document and append afterwards
import ProgressBar from './components/Misc/ProgressBar.vue'
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

// config router
import { getToken } from './util/auth'
router.beforeEach((to, from, next) => {
  bar.start()
  console.log(from.fullPath)
  if (to.meta.auth) {
    let localToken = getToken()
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

export default router
