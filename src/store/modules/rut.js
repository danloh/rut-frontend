// import axios from '@/main'
import { fetchRut } from '@/api/api'

// initial state
const perPage = 20
const state = {
  indexRuts: [],
  showTags: [],
  rutDetail: {}
}

// actions
const actions = {
  getRut: ({commit}, rutid) => {
    return new Promise((resolve, reject) => {
      fetchRut(rutid).then(resp => {
        commit('SET_RUT', resp.data)
        resolve(resp)
      }).catch(error => { reject(error) })
    })
  }
}

// mutations
const mutations = {
  SET_INDEX (state, data) {
    state.indexRuts = data.ruts
    state.showTags = data.tags.slice(0, perPage)
  },
  SET_RUT (state, data) {
    state.rutDetail = data
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
