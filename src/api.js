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
let base = 'http://127.0.0.1:8083/api'
const request = (url, options = {}, method = 'get') => {
  let key = ~['delete', 'get', 'head'].indexOf(method) ? 'params' : 'data' // bitwise NOT: ~N -> -(N+1)
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
const fetchUser = (userid, params) => {
  return request(`${base}/users/${userid}`, params)
}
// get user info
const updateUser = (userid, params) => {
  return request(`${base}/users/${userid}`, params, 'post')
}
// create new rut
const newRut = params => {
  return request(`${base}/ruts`, params, 'post')
}
// update rut
const updateRut = (rutid, params) => {
  return request(`${base}/ruts/${rutid}`, params, 'post')
}
// get a rut
const fetchRut = (rutid, params) => {
  return request(`${base}/ruts/${rutid}`, params)
}
// get rut list per user, tag, flag should be create, star
const fetchRuts = (per, tid, flag=0, params={}) => {
  return request(`${base}/ruts/${per}/${tid}/${flag}`, params)
}
// get ruts for index page
const fetchIndexRuts = () => fetchRuts('index','index')
// update an item
const collectItem = (rutid, params) => {
  return request(`${base}/ruts/${rutid}/collect`, params, 'post')
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
const fetchItems = (per, id, flag=0, params={}) => {
  return request(`${base}/items/${per}/${id}/${flag}`, params)
}
// get collect
const fetchCollect = (rutid, itemid, params) => {
  return request(`${base}/${rutid}/collects/${itemid}`, params)
}
// update an item
const updateItem = (itemid, params) => {
  return request(`${base}/items/${itemid}`, params, 'post')
}

export {
  axios,
  signup,
  checkUser,
  signin,
  fetchUser,
  updateUser,
  newRut,
  updateRut,
  fetchIndexRuts,
  fetchRut,
  fetchRuts,
  collectItem,
  newItem,
  fetchItem,
  fetchCollect,
  fetchItems,
  updateItem
}
