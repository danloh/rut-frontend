import {
  fetchItem,
  fetchReview
} from '@/api/api'

// initial state
const state = {
  currentItem: {},
  reviewDetail: {},
  searchItems: [],
  itemKeyword: ''
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
  },
  SET_SEARCH_ITEMS: (state, data) => {
    state.searchItems = data.items
    state.itemKeyword = data.keyword
  },
  MORE_SEARCH_ITEMS: (state, data) => {
    state.searchItems.push(...data.items)
  }
}

export default {
  state,
  actions,
  mutations
}
