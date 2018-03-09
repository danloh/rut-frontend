import { fetchProfileRuts, fetchRoads } from '@/api/api'

// initial state
const state = {
  createdRuts: [],
  onRoads: [],
  sdoneItems: []
}

// actions, can be del? no needed
const actions = {
  preloadRuts: ({commit}, userid) => {
    return new Promise((resolve, reject) => {
      fetchProfileRuts('created', userid).then(resp => {
        commit('SET_RUTS', resp.data.ruts)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  preloadRoads: ({commit}, userid) => {
    return new Promise((resolve, reject) => {
      fetchRoads(userid).then(resp => {
        commit('SET_ROADS', resp.data.roads)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

// mutations
const mutations = {
  SET_RUTS (state, data) {
    state.createdRuts = data
  },
  SET_ROADS (state, data) {
    state.onRoads = data
  },
  ADD_ITEMS (state, data) {
    state.sdoneItems.unshift(...data)
    state.sdoneItems = Array.from(new Set(state.sdoneItems)) // de-dup, why not work?
  }
}

export default {
  state,
  actions,
  mutations
}
