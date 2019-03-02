import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import rut from './modules/rut'
import item from './modules/item'

Vue.use(Vuex)

import { signin } from '../api'
import {
  getToken, setToken, removeToken, getID, setID, removeID, checkAuth
} from '../util/auth'

export default new Vuex.Store({
  state: {
    token: getToken(),
    authed: checkAuth(),
    actID: getID(),
    actUser: {}
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
    SET_INFO (state, userobj) {
      state.actUser = userobj
    },
  },

  actions: {
    login: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        signin(data).then(resp => {
          let res = resp.data
          // console.log(res)
          if (res.status !== 200) {
            this.$message("Something Failed")
            return
          }
          let d = Object.assign(res, { userid: res.user.id } )
          commit('SET_TOKEN', d)
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  
  getters,
  modules: {
    rut, item
  }
})
