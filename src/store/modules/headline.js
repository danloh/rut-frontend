// import axios from '@/main'
import {
  fetchHeadlines,
  newHeadline
} from '@/api/api'

// initial state
const perPage = 20
const state = {
  totalHeadlines: 0,
  currentHeadlines: [],
  currentH: 0,
  maxH: 0
}

// actions
const actions = {
  getHeadlines: ({commit}, params) => {
    return fetchHeadlines(params)
    .then(resp => {
      commit('SET_HEADLINES', resp.data)
    })
  },
  postHeadline: ({commit}, params) => {
    return newHeadline(params)
    .then(resp => {
      commit('ADD_HEADLINE', resp.data)
    })
  },
  moreHeadlines: ({commit}, params) => {
    return fetchHeadlines(params)
    .then(resp => {
      commit('MORE_HEADLINES', resp.data.headlines)
    })
  }
}

// mutations
const mutations = {
  SET_HEADLINES (state, data) {
    state.totalHeadlines = data.total
    state.currentH = 1
    state.maxH = Math.ceil(data.total / perPage)
    state.currentHeadlines = data.headlines
  },
  MORE_HEADLINES (state, data) {
    state.currentH += 1
    state.currentHeadlines.push(...data)
  },
  ADD_HEADLINE (state, data) {
    state.currentHeadlines.unshift(data)
  }
}

export default {
  state,
  actions,
  mutations
}
