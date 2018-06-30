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
const Headlines = () => import('@/view/Headlines')
const HeadlineView = () => import('@/view/HeadlineView')
const EditArticle = () => import('@/components/Headline/EditArticle')
const Circles = () => import('@/view/Circles')
const Profile = () => import('@/view/Profile')
const RoadView = () => import('@/view/RoadView')
const NewRoad = () => import('@/components/Road/NewRoad')
const RutView = () => import('@/view/RutView')
const RutComment = () => import('@/view/RutComment')
const ItemView = () => import('@/view/ItemView')
const TagView = () => import('@/view/TagView')
const TagRut = () => import('@/components/Tag/TagRuts')
const TagDemand = () => import('@/components/Tag/TagDemands')
const TagItem = () => import('@/components/Tag/TagItems')
const TagComment = () => import('@/components/Tag/TagComments')
const SearchResult = () => import('@/view/SearchResult')
const About = () => import('@/components/Misc/About')
const NotFound = () => import('@/view/NotFound')
const Register = () => import('@/components/Auth/Register')
const Confirm = () => import('@/components/Auth/Confirm')
const Forget = () => import('@/components/Auth/Forget')
const ResetPsw = () => import('@/components/Auth/ResetPsw')
const ChangePsw = () => import('@/components/Auth/ChangePsw')
const Login = () => import('@/components/Auth/Login')
const Create = () => import('@/components/Rut/Create')
const ReadMode = () => import('@/components/Rut/ReadMode')
const EditRut = () => import('@/components/Rut/EditRut')
const AddItem = () => import('@/components/Rut/AddItem')
const EditTips = () => import('@/components/Rut/EditTips')
const NewItem = () => import('@/components/Item/NewItem')
const EditItem = () => import('@/components/Item/EditItem')
const NewArticle = () => import('@/components/Headline/NewArticle')
const MyItemRC = () => import('@/components/Item/MyItemRC')
const createClipList = params => () => import('@/components/Challenge/CreateClipList').then(m => m.default(params))
const createDemandList = params => () => import('@/components/Demand/CreateDemandList').then(m => m.default(params))
const createHList = param => () => import('@/components/Headline/CreateHList').then(m => m.default(param))
const createProfileRuts = param => () => import('@/components/Profile/CreateProfileRuts').then(m => m.default(param))
const createProfileItems = param => () => import('@/components/Profile/CreateProfileItems').then(m => m.default(param))
const ProfileRoads = () => import('@/components/Profile/ProfileRoads')
const ProfileArticles = () => import('@/components/Profile/ProfileArticles')
const ProfileDemands = () => import('@/components/Profile/ProfileDemands')
const ProfileClips = () => import('@/components/Profile/ProfileClips')
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
    { path: '/login', component: Login, name: 'Login' },
    { path: '/create/:id(\\d+)?', component: Create, name: 'CreateRut', meta: {auth: true} },
    { path: '/readlist/:id', component: RutView, name: 'Rutview' },
    { path: '/readlist/:id/readmode', component: ReadMode, name: 'ReadMode' },
    { path: '/edit/readlist/:id',
      component: EditRut,
      name: 'EditRut',
      meta: {auth: true},
      beforeEnter
    },
    { path: '/additemto/readlist/:id',
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
    { path: '/commenton/rut/:id', component: RutComment, name: 'RutComment', meta: {auth: true} },
    { path: '/item/:id', component: ItemView, name: 'Item' },
    { path: '/myrc/item/:itemid', component: MyItemRC, name: 'MyRc', props: true, meta: {auth: true} },
    { path: '/edit/item/:id', component: EditItem, name: 'EditItem', meta: {auth: true} },
    { path: '/newarticle/:id(\\d+)?', component: NewArticle, name: 'NewArticle', meta: {auth: true} },
    { path: '/editarticle/:id', component: EditArticle, name: 'EditArticle', meta: {auth: true} },
    { path: '/tag/:name',
      component: TagView,
      children: [
        { path: '', name: 'defaultTag', redirect: 'readlist' },
        { path: 'readlist', name: 'TagReadlist', component: TagRut, meta: {auth: true} },
        { path: 'demand', name: 'TagDemand', component: TagDemand, meta: {auth: true} },
        { path: 'item', name: 'TagItem', component: TagItem, meta: {auth: true} },
        { path: 'comment', name: 'TagComment', component: TagComment, meta: {auth: true} }
      ]
    },
    { path: '/demands',
      component: Demands,
      children: [
        { path: '', name: 'defaultdemand', redirect: 'popular' },
        { path: 'popular', name: 'Hotdemand', component: createDemandList({ref: 'hot'}), meta: {auth: true} },
        { path: 'new', name: 'Newdemand', component: createDemandList({ref: 'new'}), meta: {auth: true} }
      ]
    },
    { path: '/demand/:id', name: 'demand', component: DemandView, meta: {auth: true} },
    { path: '/challenge',
      component: Challenge,
      children: [
        { path: '', name: 'defaultclip', redirect: 'myclip' },
        { path: 'myclip', name: 'Myclip', component: createClipList({ref: 'My'}), meta: {auth: true} },
        { path: 'hotclip', name: 'Hotclip', component: createClipList({ref: 'Hot'}), meta: {auth: true} },
        { path: 'allclip', name: 'Allclip', component: createClipList({ref: 'All'}), meta: {auth: true} }
      ]
    },
    { path: '/headline/:id', name: 'Headline', component: HeadlineView, meta: {auth: true} },
    { path: '/headlines',
      component: Headlines,
      children: [
        { path: '', name: 'defaultheadline', redirect: 'top' },
        { path: 'top', name: 'TopHeadline', component: createHList('top') },
        { path: 'new', name: 'NewHeadline', component: createHList('new') }
      ]
    },
    { path: '/circles', name: 'Circles', component: Circles, meta: {auth: true} },
    { path: '/profile/:id',
      component: Profile,
      children: [
        { path: '', name: 'defaultProfile', redirect: 'activity' },
        { path: 'activity', name: 'Activity', component: ProfileActivity, meta: {auth: true} },
        { path: 'roadmaps', name: 'Roadmaps', component: ProfileRoads, meta: {auth: true} },
        { path: 'created', name: 'CreatedRuts', component: createProfileRuts('created'), meta: {auth: true} },
        { path: 'star', name: 'StarRuts', component: createProfileRuts('star'), meta: {auth: true} },
        { path: 'working', name: 'WorkingItems', component: createProfileItems('doing'), meta: {auth: true} },
        { path: 'scheduled', name: 'ScheduledItems', component: createProfileItems('todo'), meta: {auth: true} },
        { path: 'havedone', name: 'DoneItems', component: createProfileItems('done'), meta: {auth: true} },
        { path: 'articles', name: 'Articles', component: ProfileArticles, meta: {auth: true} },
        { path: 'demands', name: 'Demands', component: ProfileDemands, meta: {auth: true} },
        { path: 'clips', name: 'Clips', component: ProfileClips, meta: {auth: true} },
        { path: 'followeds', name: 'Followeds', component: FollowedList, meta: {auth: true} }
      ]
    },
    { path: '/newroad', component: NewRoad, name: 'NewRoad', meta: {auth: true} },
    { path: '/roadmap/:id', component: RoadView, name: 'RoadView' },
    { path: '/setting/:id',
      component: Setting,
      children: [
        { path: '', name: 'defaultSetting', redirect: 'setting' },
        { path: 'setting', name: 'Setting', component: EditProfile, beforeEnter: beforeEnterSet, meta: {auth: true} },
        { path: 'change', name: 'Change', component: ChangePsw, beforeEnter: beforeEnterSet, meta: {auth: true} }
      ]
    },
    { path: '/newitem', component: NewItem, name: 'NewItem', meta: {auth: true} },
    { path: '/searchresult/:type', component: SearchResult, name: 'SearchResult', props: true },
    { path: '/about', component: About, name: 'About' },
    { path: '/404', component: NotFound, name: 'NotFound', hidden: true },
    { path: '*', hidden: true, redirect: { path: '/404' } }
  ]
})

export default router
