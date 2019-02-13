import Vue from 'vue'
import Router from 'vue-router'

// import components, lazy loading, code splitting
const Home = () => import('./views/Home')
const RutView = () => import('./views/RutView')
const NewRut = () => import('./components/Rut/NewRut')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/r/:id', name: 'Rutview', component: RutView },
    { path: '/new', name: 'NewRut', component: NewRut }
  ]
})
