// store.module.rut

import Vue from 'vue'
import { fetchRut, fetchIndexRuts } from '../../api'

// initial state
const perPage = 20
const state = {
  indexRuts: [],
  ruts: {/* [slug]: rut */},
}

// actions
const actions = {
  getRut: ({ commit, state }, rutslug) => {
    const rut = state.ruts[rutslug]
    const now = Date.now()
    return new Promise((resolve, reject) => {
      if ( rut && rut.slug == rutslug && now - rut.lastUpdate < 1000*60*5 ) {
        //console.log('no need re-fetch')
        resolve(rut) 
      } else {
        fetchRut(rutslug).then(resp => {
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
        commit('SET_RUTS', ruts, true)
        resolve(ruts)
      }).catch(error => { reject(error) })
    })
  }
}

// mutations
const mutations = {
  SET_RUTS (state, data, index=false) {
    if (index) { state.indexRuts = data }
    data.forEach(r => {
      const rslug = r.slug
      const rut = state.ruts[rslug]
      if (!rut) {
        let rutdata = Object.assign({ lastUpdate: Date.now() }, r)
        Vue.set(state.ruts, rslug, rutdata)
      }
    });
  },
  SET_RUT (state, { rut }) {
    let rutslug = rut.slug
    // set a update timestamp
    let rutdata = Object.assign({ lastUpdate: Date.now() }, rut)
    Vue.set(state.ruts, rutslug, rutdata)
  },
  RENEW_RUT (state, data) {
    try {  // if can hit
      state.ruts[data.rutslug][data.ref] = data[data.ref] 
    } catch {
      return
    }
  }
}

export default {
  state,
  actions,
  mutations
}
