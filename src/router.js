import Vue from 'vue'
import Router from 'vue-router'

// import components, lazy loading, code splitting
const Home = () => import('./views/Home')
const Register = () => import('./components/Auth/Register.vue')
const Login = () => import('./components/Auth/Login.vue')
const Profile = () => import('./views/Profile')
const createRutList = (p,a,i) => () => import('./components/Rut/CreateRutList').then(m => m.default(p,a,i))
const createItemList = (p,f,i) => () => import('./components/Item/CreateItemList').then(m => m.default(p,f,i))
const UpdateUser = () => import('./components/User/UpdateUser')
const RutView = () => import('./views/RutView')
const RutForum = () => import('./views/RutForum')
const NewRut = () => import('./components/Rut/NewRut')
const UpdateRut = () => import('./components/Rut/UpdateRut')
const AddItem = () => import('./components/Rut/AddItem')
const NewItem = () => import('./components/Item/NewItem')
const UpdateItem = () => import('./components/Item/UpdateItem')
const ItemView = () => import('./views/ItemView')
const TagView = () => import('./views/TagView')
const NotFound = () => import('./views/NotFound.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/register', component: Register, name: 'Register' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/p/:id', component: Profile, meta: {auth: true},
      children: [
        { path: '', name: 'defaultProfile', redirect: 'doing' }, 
        { path: 'created', name: 'CreatedRuts', component: createRutList('user', 'create'), meta: {auth: true} },
        { path: 'star', name: 'StarRuts', component: createRutList('user', 'star'), meta: {auth: true} },
        { path: 'todo', name: 'Todos', component: createItemList('user', 'todo'), meta: {auth: true} },
        { path: 'doing', name: 'Doings', component: createItemList('user', 'doing'), meta: {auth: true} },
        { path: 'done', name: 'Dones', component: createItemList('user', 'done'), meta: {auth: true} },
      ] 
    },
    { path: '/updateuser/:id', name: 'UpdateUser', component: UpdateUser, meta: {auth: true} },
    { path: '/r/:id', name: 'Rutview', component: RutView },
    { path: '/rforum/:id', name: 'RutForum', component: RutForum },
    { path: '/new', name: 'NewRut', component: NewRut, meta: {auth: true} },
    { path: '/update/r/:id', name: 'UpdateRut', component: UpdateRut, meta: {auth: true} },
    { path: '/collect/:id', name: 'AddItem', component: AddItem, meta: {auth: true} },
    { path: '/submit', name: 'NewItem', component: NewItem, meta: {auth: true} },
    { path: '/item/:id', name: 'Itemview', component: ItemView },
    { path: '/update/item/:id', name: 'UpdateItem', component: UpdateItem, meta: {auth: true} },
    { path: '/tag/:id', component: TagView,  // must id as tname, for sub-componenet to extract params.id
      children: [
        { path: '', name: 'defaultTagView', redirect: 'r' },
        { path: 'r', name: 'TagRuts', component: createRutList('tag') },
      ] 
    },
    { path: '/404', component: NotFound, name: 'NotFound', hidden: true },
    { path: '*', hidden: true, redirect: { path: '/404' } },
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
  //console.log(from.fullPath)
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
