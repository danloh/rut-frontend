// import axios from '@/main'
import {
  fetchDemands,
  fetchDemand,
  newDemand
} from '@/api/api'

// initial state
const perPage = 20
const state = {
  totalDemands: 0,
  currentD: 0,
  currentDemands: [],
  demandDetail: {},
  maxD: 0,
  perD: perPage
}

// actions
const actions = {
  getDemands: ({commit, state}, params) => {
    return fetchDemands(params)
    .then(resp => {
      commit('SET_DEMANDS', resp.data)
    })
  },
  getDemand: ({commit}, demandid) => {
    return new Promise((resolve, reject) => {
      fetchDemand(demandid)
      .then(resp => {
        commit('SET_DEMAND', resp.data)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  postDemand: ({commit, state}, params) => {
    return newDemand(params)
    .then(resp => {
      commit('ADD_DEMAND', resp.data)
    })
  },
  moreDemands: ({commit, state}, params) => {
    return fetchDemands(params)
    .then(resp => {
      commit('MORE_DEMANDS', resp.data.demands)
    })
  }
}

// mutations
const mutations = {
  SET_DEMANDS (state, data) {
    state.totalDemands = data.total
    state.currentD = 1
    state.maxD = Math.ceil(data.total / perPage)
    state.currentDemands = data.demands
  },
  MORE_DEMANDS (state, data) {
    state.currentD += 1
    state.currentDemands.push(...data)
  },
  ADD_DEMAND (state, data) {
    state.currentDemands.unshift(data)
  },
  SET_DEMAND (state, data) {
    state.demandDetail = data
  }
}

export default {
  state,
  actions,
  mutations
}
