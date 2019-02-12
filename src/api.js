import axios from '@/main'

let base = 'http://127.0.0.1:5000/api'
const request = (url, options = {}, method = 'get') => {
  let key = ~['delete', 'get', 'head'].indexOf(method) ? 'params' : 'data' // bitwise NOT: ~N -> -(N+1)
  return axios(Object.assign({'url': url, 'method': method}, {[key]: options}))
  .then(res => res)
}

// create new rut
const newRut = params => {
  return request(`${base}/ruts`, params, 'post')
}
// get ruts for index page
const fetchIndexRuts = params => {
  return request(`${base}/ruts/index`, params)
}
// get a rut
const fetchRut = (rutid, params) => { // !!
  return request(`${base}/ruts/${rutid}`, params)
}


export {
  axios,
  newRut,
  fetchIndexRuts,
  fetchRut
}
