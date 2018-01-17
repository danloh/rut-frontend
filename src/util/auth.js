import Cookies from 'js-cookie'
import axios from '@/main'

const TokenKey = 'R-Token'
const IDKey = 'R-ID'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token, exp = 0) {
  return Cookies.set(TokenKey, token, { expires: exp }) // unit: day
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function getID () {
  return Cookies.get(IDKey)
}

export function setID (id, exp = 0) {
  return Cookies.set(IDKey, id, { expires: exp })
}

export function removeID () {
  return Cookies.remove(IDKey)
}

export function checkAuth () {
  let localToken = getToken()
  axios.defaults.auth = {
    username: localToken,
    password: localToken
  }
  if (localToken) {
    return true
  } else {
    return false
  }
}
