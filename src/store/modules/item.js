import {
  fetchItem,
  fetchReview
} from '@/api/api'

// initial state
const state = {
  currentItem: {},
  reviewDetail: {}
}
// actions
const actions = {
  getItem: ({commit}, itemid) => {
    return new Promise((resolve, reject) => {
      fetchItem(itemid).then(resp => {
        commit('SET_ITEM', resp.data)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getReview: ({commit}, reviewid) => {
    return new Promise((resolve, reject) => {
      fetchReview(reviewid).then(resp => {
        commit('SET_REVIEW', resp.data)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
// mutations
const mutations = {
  SET_ITEM: (state, data) => {
    state.currentItem = data
  },
  SET_REVIEW: (state, data) => {
    state.reviewDetail = data
  }
}

export default {
  state,
  actions,
  mutations
}
