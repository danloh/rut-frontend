import Vue from 'vue'
import Vuex from 'vuex'
import rut from './modules/rut'

Vue.use(Vuex)

import { signin } from '../api'
import {
  getToken, setToken, removeToken, getID, setID, removeID, checkAuth
} from '../util/auth'

export default new Vuex.Store({
  state: {
    token: getToken(),
    authed: checkAuth(),
    actID: getID()
  },

  mutations: {
    SET_TOKEN (state, obj) {
      let token = obj.token
      let userid = obj.userid
      state.token = token
      state.actID = userid
      state.authed = Boolean(userid)
      setToken(token, obj.exp)
      setID(userid, obj.exp)
    },
    DEL_TOKEN (state) {
      state.token = ''
      state.authed = false
      removeToken()
      removeID()
    },
  },

  actions: {
    login: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        signin(data).then(resp => {
          let res = resp.data
          if (res.status !== 200) return // ??
          let d = Object.assign(res, { userid: res.user.id } )
          commit('SET_TOKEN', d)
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },

  modules: {
    rut
  }
})
