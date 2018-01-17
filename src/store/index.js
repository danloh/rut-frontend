import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, setToken, removeToken, getID, setID, removeID } from '@/util/auth'
import getters from './getters'
import rut from './modules/rut'
import item from './modules/item'
import clip from './modules/clip'
import demand from './modules/demand'

Vue.use(Vuex)

// for auth user
const state = {
  currentUserID: Number(getID()),
  authed: Boolean(getID()) && Boolean(getToken()),
  token: getToken(),
  currentUser: null,
  whoEdit: {}
}
const mutations = {
  SET_USER (state, obj) {
    let userid = obj.userid
    state.currentUserID = userid
    state.authed = Boolean(userid)
    setID(userid, obj.exp)
  },
  SET_TOKEN (state, obj) {
    let token = obj.token
    state.token = token
    setToken(token, obj.exp)
  },
  SET_INFO (state, userobj) {
    state.currentUser = userobj
  },
  DEL_TOKEN (state) {
    state.token = ''
    state.currentUserID = ''
    state.currentUser = null
    state.authed = false
    removeToken()
    removeID()
  },
  SET_WHOEDIT (state, data) {
    state.whoEdit = data
  }
}

import { fetchCurrentUser, register, login } from '@/api/api'

const actions = {
  getCurrentUser: ({ commit }) => {
    return new Promise((resolve, reject) => {
      fetchCurrentUser()
      .then(resp => {
        commit('SET_INFO', resp.data)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  registerUser: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      register(data).then(resp => {
        let d = resp.data
        commit('SET_TOKEN', d) // as login
        commit('SET_USER', d) // as login
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  loginUser: ({ commit }, params) => {
    return new Promise((resolve, reject) => {
      login(params).then(resp => {
        let d = resp.data
        commit('SET_TOKEN', d)
        commit('SET_USER', d)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
// store instance
const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules: {
    rut,
    item,
    clip,
    demand
  }
})

export default store
