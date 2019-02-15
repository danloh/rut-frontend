// api

import axios from '@/main'

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

// create new rut
const newRut = params => {
  return request(`${base}/ruts`, params, 'post')
}
// get ruts for index page
const fetchIndexRuts = params => {
  return request(`${base}/ruts/2/index`, params)
}
// get a rut
const fetchRut = (rutid, params) => {
  return request(`${base}/ruts/${rutid}`, params)
}


export {
  axios,
  signup,
  checkUser,
  signin,
  newRut,
  fetchIndexRuts,
  fetchRut
}
