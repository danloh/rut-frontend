import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import store from '@/store'
// import components, lazy loading, code splitting
const Home = () => import('@/view/Home')
const Feeds = () => import('@/view/Feeds')
const Challenge = () => import('@/view/Challenge')
const Demands = () => import('@/view/Demands')
const DemandView = () => import('@/view/DemandView')
const Profile = () => import('@/view/Profile')
const RutView = () => import('@/view/RutView')
const RutComment = () => import('@/view/RutComment')
const ItemView = () => import('@/view/ItemView')
const ReviewView = () => import('@/view/ReviewView')
const TagView = () => import('@/view/TagView')
const NotFound = () => import('@/view/NotFound')
const Register = () => import('@/components/Auth/Register')
const Confirm = () => import('@/components/Auth/Confirm')
const Forget = () => import('@/components/Auth/Forget')
const ResetPsw = () => import('@/components/Auth/ResetPsw')
const ChangePsw = () => import('@/components/Auth/ChangePsw')
const Login = () => import('@/components/Auth/Login')
const Create = () => import('@/components/Rut/Create')
const EditRut = () => import('@/components/Rut/EditRut')
const AddItem = () => import('@/components/Rut/AddItem')
const EditTips = () => import('@/components/Rut/EditTips')
const EditItem = () => import('@/components/Item/EditItem')
const NewReview = () => import('@/components/Item/NewReview')
const EditReview = () => import('@/components/Item/EditReview')
const MyItemRC = () => import('@/components/Item/MyItemRC')
// import createClipList from '@/components/Challenge/CreateClipList'
// import createDemandList from '@/components/Demand/CreateDemandList'
const createClipList = params => () => import('@/components/Challenge/CreateClipList').then(m => m.default(params))
const createDemandList = param => () => import('@/components/Demand/CreateDemandList').then(m => m.default(param))
const createProfileRuts = param => () => import('@/components/Profile/CreateProfileRuts').then(m => m.default(param))
const createProfileItems = param => () => import('@/components/Profile/CreateProfileItems').then(m => m.default(param))
const ProfileReviews = () => import('@/components/Profile/ProfileReviews')
const ProfileDemands = () => import('@/components/Profile/ProfileDemands')
const ProfileActivity = () => import('@/components/Profile/ProfileActivity')
const Setting = () => import('@/components/Profile/Setting')
const EditProfile = () => import('@/components/Profile/EditProfile')
const FollowedList = () => import('@/components/Profile/FollowedList')

// for go back / forward scrollBehavior
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    const position = {x: 0, y: 0}
    return position
  }
}

import { checkEditable } from '@/api/api'
// for auth edit rut
const beforeEnter = (to, from, next) => {
  let currentUserID = store.getters.currentUserID
  let rutid = store.getters.rutDetail.id
  if (currentUserID && rutid) {
    checkEditable(currentUserID, rutid).then(res => {
      if (res.data.canedit) {
        next()
      } else {
        store.commit('SET_WHOEDIT', res.data)
        new Vue().$message('In Editing...Please Try Later')
      }
    })
  } else {
    new Vue().$message('In Editing...Please Go back')
  }
}
// for profile setting
const beforeEnterSet = (to, from, next) => {
  let currentUserID = store.getters.currentUserID
  let profileID = to.params.id
  if (currentUserID === Number(profileID)) {
    next()
  }
}

const router = new Router({
  mode: 'history',
  fallback: false,
  scrollBehavior, // : () => ({y: 0}),
  routes: [
    { path: '/', component: Home, name: 'Home' },
    { path: '/feeds', component: Feeds, name: 'Feeds', meta: {auth: true} },
    { path: '/register', component: Register, name: 'Register' },
    { path: '/confirm/:token', component: Confirm, name: 'Confirm', meta: {auth: true} },
    { path: '/forget', component: Forget, name: 'Forget' },
    { path: '/reset/:token', component: ResetPsw, name: 'ResetPsw' },
    { path: '/changepsw', component: ChangePsw, name: 'ChangePsw' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/tag/:id', component: TagView, name: 'Tag' },
    { path: '/create/:id(\\d+)?', component: Create, name: 'CreateRut', meta: {auth: true} },
    { path: '/readuplist/:id', component: RutView, name: 'Rutview' },
    { path: '/edit/readuplist/:id',
      component: EditRut,
      name: 'EditRut',
      meta: {auth: true},
      beforeEnter
    },
    { path: '/additemto/readuplist/:id',
      component: AddItem,
      name: 'AddItem',
      meta: {auth: true},
      beforeEnter
    },
    { path: '/edit/readuptips/:id',
      component: EditTips,
      name: 'EditTips',
      meta: {auth: true},
      beforeEnter
    },
    { path: '/commenton/rut/:id', component: RutComment, name: 'RutComment' },
    { path: '/item/:id', component: ItemView, name: 'Item' },
    { path: '/myrc/item/:itemid', component: MyItemRC, name: 'MyRc', props: true, meta: {auth: true} },
    { path: '/edit/item/:id', component: EditItem, name: 'EditItem', meta: {auth: true} },
    { path: '/review/item/:id', component: NewReview, name: 'NewReview', meta: {auth: true} },
    { path: '/editreview/:id', component: EditReview, name: 'EditReview', meta: {auth: true} },
    { path: '/review/:id', component: ReviewView, name: 'ReviewView' },
    { path: '/demands',
      component: Demands,
      children: [
        { path: '', name: 'defaultdemand', redirect: 'popular' },
        { path: 'popular', name: 'Populardemand', component: createDemandList('popular') },
        { path: 'new', name: 'Newdemand', component: createDemandList('new') }
      ]
    },
    { path: '/demand/:id', name: 'demand', component: DemandView },
    { path: '/challenge',
      component: Challenge,
      meta: {auth: true},
      children: [
        { path: '', name: 'defaultclip', redirect: 'hotclip' },
        { path: 'myclip', name: 'Myclip', component: createClipList(), meta: {auth: true} },
        { path: 'hotclip', name: 'Hotclip', component: createClipList({ref: 'Hot'}), meta: {auth: true} },
        { path: 'allclip', name: 'Allclip', component: createClipList({ref: 'All'}), meta: {auth: true} }
      ]
    },
    { path: '/profile/:id',
      component: Profile,
      children: [
        { path: '', name: 'defaultProfile', component: ProfileActivity },
        { path: 'created', name: 'CreatedRuts', component: createProfileRuts('created') },
        { path: 'star', name: 'StarRuts', component: createProfileRuts('star') },
        { path: 'challenge', name: 'ChallengeRuts', component: createProfileRuts('challenge') },
        { path: 'working', name: 'WorkingItems', component: createProfileItems('doing') },
        { path: 'scheduled', name: 'ScheduledItems', component: createProfileItems('todo') },
        { path: 'havedone', name: 'DoneItems', component: createProfileItems('done') },
        { path: 'reviews', name: 'Reviews', component: ProfileReviews },
        { path: 'demands', name: 'Demands', component: ProfileDemands },
        { path: 'followeds', name: 'Followeds', component: FollowedList }
      ]
    },
    { path: '/setting/:id',
      component: Setting,
      children: [
        { path: '', name: 'defaultSetting', redirect: 'setting' },
        { path: 'setting', name: 'Setting', component: EditProfile, beforeEnter: beforeEnterSet, meta: {auth: true} },
        { path: 'change', name: 'Change', component: ChangePsw, beforeEnter: beforeEnterSet, meta: {auth: true} }
      ]
    },
    { path: '/404', component: NotFound, name: 'NotFound', hidden: true },
    { path: '*', hidden: true, redirect: { path: '/404' } }
  ]
})

export default router
