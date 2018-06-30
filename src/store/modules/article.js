// import axios from '@/main'
import {
  fetchArticles,
  newArticle
} from '@/api/api'

// initial state
const perPage = 20
const state = {
  totalArticles: 0,
  currentArticles: [],
  currentArticle: {},
  currentH: 0,
  maxH: 0
}

// actions
const actions = {
  getArticles: ({commit}, params) => {
    fetchArticles(params).then(resp => {
      commit('SET_ARTICLES', resp.data)
    })
  },
  postArticle: ({commit}, params) => {
    return new Promise((resolve, reject) => {
      newArticle(params).then(resp => {
        commit('SET_ARTICLE', resp.data)
        commit('ADD_ARTICLE', resp.data)
        resolve(resp)
      }).catch(err => { reject(err) })
    })
  },
  moreArticles: ({commit}, params) => {
    fetchArticles(params).then(resp => {
      commit('MORE_ARTICLES', resp.data.articles)
    })
  }
}

// mutations
const mutations = {
  SET_ARTICLE (state, data) {
    state.currentArticle = data
  },
  SET_ARTICLES (state, data) {
    state.totalArticles = data.total
    state.currentH = 1
    state.maxH = Math.ceil(data.total / perPage)
    state.currentArticles = data.articles
  },
  MORE_ARTICLES (state, data) {
    state.currentH += 1
    state.currentArticles.push(...data)
  },
  ADD_ARTICLE (state, data) {
    state.currentArticles.unshift(data)
  }
}

export default {
  state,
  actions,
  mutations
}
