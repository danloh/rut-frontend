// api
import Vue from 'vue'
import axios from 'axios'
import { getToken } from './util/auth'
import router from './router'
import store from './store'

// Axios config
// Request interceptor
axios.interceptors.request.use(
  config => {
    let token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
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
          if (router.currentRoute.path !== '/login') {
            router.push({
              path: '/login',
              query: {redirect: router.currentRoute.fullPath}
            })
            alert('Access Denied, Need To Log in')
          }
          break
        case 403:
          alert('Forbidden')
          break
        case 404:
          alert('Not Found')
          router.replace({ path: '/404' })
          break
        case 418:
          alert('Eureka! 42')
          break
        case 500:
          alert('InternalError')
          router.replace({ path: '/' })
          break
        default:
          alert('Something Failed: ' + error.response.statusText)
      }
    }
    // console.log(error.response.data)
    return Promise.reject(error)
  }
)
// register axios as default http client
Vue.prototype.$http = axios

// request factory
const base = 'http://127.0.0.1:8083/api'
// const base = 'https://ruthub.com/api'
const request = (url, options = {}, method = 'get') => {
  let key = ~['get', 'head', 'delete'].indexOf(method) ? 'params' : 'data' // bitwise NOT: ~N -> -(N+1)
  return axios(Object.assign({'url': url, 'method': method}, {[key]: options}))
  .then(res => res)
}

// regsiter
const signup = data => {
  return request(`${base}/signup`, data, 'post')
}
// check if uname signed-up
const checkUser = (uname, params) => {
  return request(`${base}/checkuser/${uname}`, params)
}
// login
const signin = data => {
  return request(`${base}/signin`, data, 'post')
}
// get user info
const fetchUser = (uname, params) => {
  return request(`${base}/users/${uname}`, params)
}
// update user info
const updateUser = (uname, params) => {
  return request(`${base}/users/${uname}`, params, 'post')
}
// change Psw
const changePsw = (uname, params) => {
  return request(`${base}/users/${uname}`, params, 'put')
}
// create new rut
const newRut = params => {
  return request(`${base}/ruts`, params, 'post')
}
// update rut
const updateRut = params => {
  return request(`${base}/ruts`, params, 'put')
}
// tag rut
const tagRut = (act, rutid, params) => { // action: 0-untag,1-tag
  return request(`${base}/tagr/${act}/${rutid}`, params, 'post')
}
// check if star or unstar rut
const checkStarRut = (rutid, params) => { // action: 0-untag,1-tag
  return request(`${base}/ifstarrut/${rutid}`, params)
}
// star or unstar rut
const starRut = (rutid, action=0, note='Love', params={}) => { // action: 0-unstar,1-star
  return request(`${base}/starrut/${rutid}/${action}/${note}`, params)
}
// get a rut
const fetchRut = (rutid) => {
  return request(`${base}/ruts/${rutid}`)
}
// get rut list per user, tag, item, flag should be create, star
const fetchRuts = (per, tid, p=1, f=0, k='', fr='') => {
  return request(
    `${base}/ruts/${per}/${tid}?page=${p}&flag=${f}&kw=${k}&fr=${fr}`
  )
}
// get ruts for index page
const fetchIndexRuts = () => fetchRuts('index','index')
// update an item
const collectItem = (rutid, params) => {
  return request(`${base}/collectitem/${rutid}`, params, 'post')
}
// submit an item
const newItem = params => {
  return request(`${base}/items`, params, 'post')
}
// get an item
const fetchItem = (itemid, params) => {
  return request(`${base}/items/${itemid}`, params)
}
// get item list per rut,tag,user; id,uiid,url,title
const fetchItems = (per, id, p=1, f='done', k='', fr='') => {
  return request(
    `${base}/items/${per}/${id}?page=${p}&flag=${f}&kw=${k}&fr=${fr}`
  )
}
// check item star flag
const checkStarItem = (itemid, params) => { // action: 0-untag,1-tag
  return request(`${base}/itemflag/${itemid}`, params)
}
// star item as 1-todo | 2-doing | 3-done
const starItem = (itemid, flag=1, rate=0, note='Love') => {
  return request(`${base}/staritem/${itemid}/${flag}/${rate}/${note}`)
}
// get collect
const fetchCollect = (cid, params) => {
  return request(`${base}/collects/${cid}`, params)
}
// get collects
const fetchCollects = (per, id, p=1, f='done', k='', fr='') => {
  return request(
    `${base}/collects/${per}/${id}?page=${p}&flag=${f}&kw=${k}&fr=${fr}`
  )
}
// update collect
const updateCollect = (cid, params) => {
  return request(`${base}/collects/${cid}`, params, 'put')
}
// del collect
const delCollect = (cid, params) => {
  return request(`${base}/collects/${cid}`, params, 'delete')
}
// update an item
const updateItem = (params) => {
  return request(`${base}/items`, params, 'put')
}
// get tag 
const fetchTag = (tname, params) => {
  return request(`${base}/tags/${tname}`, params)
}
// get tag list per rut,tag,user,item
const fetchTags = (per, id, p=1, f='done', k='', fr='') => {
  return request(
    `${base}/tags/${per}/${id}?page=${p}&flag=${f}&kw=${k}&fr=${fr}`
  )
}
// update tag 
const updateTag = (tname, params) => {
  return request(`${base}/tags/${tname}`, params, 'put')
}
// check item star flag
const checkStarTag = (tname, params) => {
  return request(`${base}/ifstartag/${tname}`, params)
}
// star item as todo | done
const starTag = (tname, action=0, note='Love', params={}) => {
  return request(`${base}/startag/${tname}/${action}/${note}`, params)
}
// submit an item
const newEtc = params => {
  return request(`${base}/etcs`, params, 'post')
}
// get etc list per rut,tag,user,item, petc
const fetchEtcs = (per, perid, p=1, f='done', k='', fr='') => {
  return request(
    `${base}/etcs/${per}/${perid}?page=${p}&flag=${f}&kw=${k}&fr=${fr}`
  )
}

export {
  base,
  axios,
  signup,
  checkUser,
  signin,
  fetchUser,
  updateUser,
  changePsw,
  newRut,
  updateRut,
  tagRut,
  starRut,
  checkStarRut,
  fetchIndexRuts,
  fetchRut,
  fetchRuts,
  collectItem,
  newItem,
  fetchItem,
  starItem,
  checkStarItem,
  fetchCollect,
  fetchCollects,
  updateCollect,
  delCollect,
  fetchItems,
  updateItem,
  fetchTag,
  fetchTags,
  updateTag,
  checkStarTag,
  starTag,
  newEtc,
  fetchEtcs
}
