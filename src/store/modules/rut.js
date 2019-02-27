// store.module.rut

import Vue from 'vue'
import { fetchRut, fetchIndexRuts } from '../../api'

// initial state
const perPage = 20
const state = {
  indexRuts: [],
  ruts: {/* [id]: rut */},
}

// actions
const actions = {
  getRut: ({ commit, state }, rutid) => {
    const rut = state.ruts[rutid]
    const now = Date.now()
    return new Promise((resolve, reject) => {
      if ( rut && rut.id == rutid && now - rut.lastUpdate < 1000*60*5 ) {
        console.log('no need re-fetch')
        resolve(rut) 
      } else {
        fetchRut(rutid).then(resp => {
          let rut = resp.data.rut
          commit('SET_RUT', { rut })
          resolve(rut)
        }).catch(error => { reject(error) })
      }
    })
  },
  getIndexRuts: ({ commit }) => {
    return new Promise((resolve, reject) => {
      fetchIndexRuts().then(resp => {
        let ruts = resp.data.ruts
        commit('SET_INDEX', ruts)
        resolve(ruts)
      }).catch(error => { reject(error) })
    })
  }
}

// mutations
const mutations = {
  SET_INDEX (state, data) {
    state.indexRuts = data
    data.forEach(r => {
      const rid = r.id
      const rut = state.ruts[rid]
      if (!rut) {
        let rutdata = Object.assign({ lastUpdate: Date.now() }, r)
        Vue.set(state.ruts, rid, rutdata)
      }
    });
  },
  SET_RUT (state, { rut }) {
    let rutid = rut.id
    // set a update timestamp
    let rutdata = Object.assign({ lastUpdate: Date.now() }, rut)
    Vue.set(state.ruts, rutid, rutdata) // as cache, need to update after edit? 
    // state.rutDetail = rut  // for edit view
  },
  RENEW_RUT (state, data) {
    state.ruts[data.rutid][data.ref] = data[data.ref]
  }
}

export default {
  state,
  actions,
  mutations
}
