// import axios from '@/main'
import {
  fetchIndexRuts,
  fetchProfileRuts,
  fetchRut,
  fetchTag
} from '@/api/api'

// initial state
const perPage = 20
const state = {
  allRuts: [],
  totalRuts: 0,
  currentPage: 0,
  currentRuts: [],
  maxPage: 0,
  perPage: perPage,
  showTags: [],
  tagDetail: {},
  rutDetail: {}
}

// actions
const actions = {
  getRuts: ({commit, state}, param) => {
    return new Promise((resolve, reject) => {
      fetchIndexRuts(param)
      .then(resp => {
        commit('SET_RUTS', resp.data)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getProfileRuts: ({commit, state}, params) => { // action: up to 2 args
    return fetchProfileRuts(params['action'], params['userid'])
    .then(resp => {
      commit('SET_RUTS', resp.data)
    })
  },
  getRut: ({commit, state}, rutid) => {
    return new Promise((resolve, reject) => {
      fetchRut(rutid)
      .then(resp => {
        commit('SET_RUT', resp.data)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getTag: ({commit, state}, tagid) => {
    return new Promise((resolve, reject) => {
      fetchTag(tagid)
      .then(resp => {
        commit('SET_RUTS', resp.data)
        commit('SET_TAG', resp.data)
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
    state.allRuts = data.ruts
    state.totalRuts = data.total
    state.currentPage = 1
    state.maxPage = Math.ceil(data.total / perPage)
    let sliced = data.ruts.slice(0, perPage)
    state.currentRuts = sliced
    state.showTags = data.tags.slice(0, perPage)
  },
  MORE_RUTS (state, data) {
    state.currentPage += 1
    state.currentRuts.push(...data)
  },
  ADD_RUTS (state, page) {
    let start = page * perPage
    let end = start + perPage
    let nextRuts = state.allRuts.slice(start, end)
    state.currentPage += 1
    state.currentRuts.push(...nextRuts)
  },
  SET_RUT (state, data) {
    state.rutDetail = data
  },
  SET_TAG (state, data) {
    state.tagDetail = data
  },
  // update tags after edit rut's tags
  NEW_TAGS (state, data) {
    state.rutDetail.tags = data
  }
}

export default {
  state,
  actions,
  mutations
}
